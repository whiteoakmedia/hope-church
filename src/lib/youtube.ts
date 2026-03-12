/**
 * YouTube Data API v3 utility for fetching videos from a specific playlist.
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
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

/**
 * Fetch videos from a specific YouTube playlist.
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

  return data.items.map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
  }));
}
