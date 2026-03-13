/**
 * YouTube Data API v3 utility for fetching videos from a specific playlist.
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string; // Actual video publish date (from videos.list)
  youtubeUrl: string;
}

interface YouTubePlaylistItemSnippet {
  publishedAt: string;
  title: string;
  description: string;
  resourceId: {
    videoId: string;
  };
}

interface YouTubePlaylistItem {
  snippet: YouTubePlaylistItemSnippet;
}

interface YouTubePlaylistResponse {
  items?: YouTubePlaylistItem[];
  nextPageToken?: string;
  error?: {
    code: number;
    message: string;
  };
}

interface YouTubeVideoSnippet {
  publishedAt: string;
  title: string;
  description: string;
}

interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeVideoSnippet;
}

interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[];
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Fetch the actual publish dates for a batch of video IDs using videos.list.
 */
async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, string>> {
  const publishDates = new Map<string, string>();

  // videos.list accepts up to 50 IDs per call
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  const data: YouTubeVideosResponse = await response.json();

  if (data.error) {
    throw new Error(
      `YouTube API error (${data.error.code}): ${data.error.message}`
    );
  }

  if (data.items) {
    for (const item of data.items) {
      publishDates.set(item.id, item.snippet.publishedAt);
    }
  }

  return publishDates;
}

/**
 * Fetch videos from a specific YouTube playlist with actual publish dates.
 *
 * @param playlistId - The YouTube playlist ID (starts with "PL")
 * @param apiKey     - YouTube Data API v3 key
 * @param maxResults - Number of results to fetch (default 50, max 50 per page)
 */
export async function fetchPlaylistVideos(
  playlistId: string,
  apiKey: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  const url = new URL(
    "https://www.googleapis.com/youtube/v3/playlistItems"
  );
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(Math.min(maxResults, 50)));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  const data: YouTubePlaylistResponse = await response.json();

  if (data.error) {
    throw new Error(
      `YouTube API error (${data.error.code}): ${data.error.message}`
    );
  }

  if (!data.items || data.items.length === 0) {
    return [];
  }

  // Get the actual video publish dates (not playlist addition dates)
  const videoIds = data.items.map((item) => item.snippet.resourceId.videoId);
  const publishDates = await fetchVideoDetails(videoIds, apiKey);

  return data.items.map((item) => {
    const videoId = item.snippet.resourceId.videoId;
    return {
      videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      // Use actual video publish date; fall back to playlist date
      publishedAt: publishDates.get(videoId) || item.snippet.publishedAt,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}
