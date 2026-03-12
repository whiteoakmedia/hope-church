import { client } from "@/sanity/client";
import { ALL_SERMONS_QUERY } from "@/sanity/queries";
import type { SanitySermon } from "@/sanity/types";
import SermonsPageClient from "@/components/SermonsPageClient";

export default async function SermonsPage() {
  const sermons = await client.fetch<SanitySermon[]>(ALL_SERMONS_QUERY);

  return <SermonsPageClient sermons={sermons} />;
}
