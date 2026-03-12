import { createClient } from "@sanity/client";

/**
 * Write-capable Sanity client for server-side mutations (e.g., CRON sync).
 * Uses a token with Editor permissions — never expose to the browser.
 */
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bb1he81m",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_TOKEN,
});
