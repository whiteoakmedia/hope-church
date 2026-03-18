import { client } from "@/sanity/client";
import { sermonsQuery } from "@/sanity/queries";
import type { Sermon } from "@/sanity/types";
import SermonsPageClient from "@/components/SermonsPageClient";

export const revalidate = 30;

export default async function SermonsPage() {
  const sermons = await client.fetch<Sermon[]>(sermonsQuery);

  return <SermonsPageClient sermons={sermons} />;
}
