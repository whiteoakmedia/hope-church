import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/write-client";
import {
  sermonsByVideoIdsQuery,
  sermonSlugExistsQuery,
  allSyncedSermonsQuery,
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
    await writeClient.fetch<boolean>(sermonSlugExistsQuery, { slug })
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

    // 4. Find existing sermons that match these video URLs
    const videoUrls = videos.map((v) => v.youtubeUrl);
    const existingSermons = await writeClient.fetch<
      { _id: string; title: string; description: string; videoUrl: string; date: string }[]
    >(sermonsByVideoIdsQuery, { videoIds: videoUrls });

    const existingMap = new Map(
      existingSermons.map((s) => [s.videoUrl, s])
    );

    // 5. Classify each video and build a transaction
    const transaction = writeClient.transaction();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const video of videos) {
      const existing = existingMap.get(video.youtubeUrl);

      if (!existing) {
        // New sermon — create it
        const slug = await uniqueSlug(slugify(video.title));

        transaction.create({
          _type: "sermon",
          title: video.title,
          slug: { _type: "slug", current: slug },
          videoUrl: video.youtubeUrl,
          description: video.description || "",
          date: video.publishedAt,
        });
        created++;
      } else if (
        existing.title !== video.title ||
        (existing.description || "") !== (video.description || "") ||
        existing.date !== video.publishedAt
      ) {
        // Title, description, or date changed — update it
        transaction.patch(existing._id, (patch) =>
          patch.set({
            title: video.title,
            description: video.description || "",
            date: video.publishedAt,
          })
        );
        updated++;
      } else {
        skipped++;
      }
    }

    // 6. Archive sermons no longer in the playlist
    const playlistVideoUrls = new Set(videos.map((v) => v.youtubeUrl));
    const allSyncedSermons = await writeClient.fetch<
      { _id: string; videoUrl: string }[]
    >(allSyncedSermonsQuery);

    let archived = 0;
    for (const sermon of allSyncedSermons) {
      if (!playlistVideoUrls.has(sermon.videoUrl)) {
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
