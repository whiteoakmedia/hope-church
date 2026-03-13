import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/write-client";
import {
  SERMONS_BY_VIDEO_IDS_QUERY,
  SERMON_SLUG_EXISTS_QUERY,
  ALL_SYNCED_SERMONS_QUERY,
} from "@/sanity/queries";
import { fetchPlaylistVideos, type YouTubeVideo } from "@/lib/youtube";

export const maxDuration = 30; // Allow up to 30s for YouTube API + Sanity mutations

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 2;

  while (
    await writeClient.fetch<boolean>(SERMON_SLUG_EXISTS_QUERY, { slug })
  ) {
    slug = `${base.slice(0, 92)}-${suffix}`;
    suffix++;
  }

  return slug;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  // 1. Authenticate — Vercel CRON sends this header automatically
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate env vars
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const sanityToken = process.env.SANITY_API_TOKEN;

  if (!playlistId || !apiKey || !sanityToken) {
    return NextResponse.json(
      {
        error: "Missing environment variables",
        missing: [
          !playlistId && "YOUTUBE_PLAYLIST_ID",
          !apiKey && "YOUTUBE_API_KEY",
          !sanityToken && "SANITY_API_TOKEN",
        ].filter(Boolean),
      },
      { status: 500 }
    );
  }

  try {
    // 3. Fetch videos from the YouTube playlist
    const videos = await fetchPlaylistVideos(playlistId, apiKey);

    if (videos.length === 0) {
      return NextResponse.json({
        success: true,
        created: 0,
        updated: 0,
        skipped: 0,
        message: "No videos found in playlist",
      });
    }

    // 4. Find existing sermons that match these video IDs
    const videoIds = videos.map((v) => v.videoId);
    const existingSermons = await writeClient.fetch<
      { _id: string; name: string; description: string; youtubeVideoId: string; datePreached: string }[]
    >(SERMONS_BY_VIDEO_IDS_QUERY, { videoIds });

    const existingMap = new Map(
      existingSermons.map((s) => [s.youtubeVideoId, s])
    );

    // 5. Classify each video and build a transaction
    const transaction = writeClient.transaction();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const video of videos) {
      const existing = existingMap.get(video.videoId);

      if (!existing) {
        // New sermon — create it
        const slug = await uniqueSlug(slugify(video.title));
        const speaker =
          process.env.DEFAULT_SERMON_SPEAKER || "Pastor";

        transaction.create({
          _type: "sermon",
          name: video.title,
          slug: { _type: "slug", current: slug },
          speaker,
          youtubeUrl: video.youtubeUrl,
          youtubeVideoId: video.videoId,
          description: video.description || "",
          datePreached: video.publishedAt,
        });
        created++;
      } else if (
        existing.name !== video.title ||
        (existing.description || "") !== (video.description || "") ||
        existing.datePreached !== video.publishedAt
      ) {
        // Title, description, or date changed — update it
        transaction.patch(existing._id, (patch) =>
          patch.set({
            name: video.title,
            description: video.description || "",
            datePreached: video.publishedAt,
          })
        );
        updated++;
      } else {
        skipped++;
      }
    }

    // 6. Archive sermons no longer in the playlist
    const playlistVideoIds = new Set(videos.map((v) => v.videoId));
    const allSyncedSermons = await writeClient.fetch<
      { _id: string; youtubeVideoId: string }[]
    >(ALL_SYNCED_SERMONS_QUERY);

    let archived = 0;
    for (const sermon of allSyncedSermons) {
      if (!playlistVideoIds.has(sermon.youtubeVideoId)) {
        transaction.patch(sermon._id, (patch) =>
          patch.set({ archived: true })
        );
        archived++;
      }
    }

    // 7. Commit the transaction (only if there are operations)
    if (created > 0 || updated > 0 || archived > 0) {
      await transaction.commit();
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      skipped,
      archived,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sermon sync failed:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
