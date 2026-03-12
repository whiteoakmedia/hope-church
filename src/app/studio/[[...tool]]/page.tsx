"use client";

/**
 * Embedded Sanity Studio – accessible at /studio
 * This provides the CMS dashboard for managing all church content.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
