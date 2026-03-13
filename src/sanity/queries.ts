/* ------------------------------------------------------------------ */
/*  Sermons                                                            */
/* ------------------------------------------------------------------ */

export const ALL_SERMONS_QUERY = `
  *[_type == "sermon" && archived != true] | order(datePreached desc) {
    name,
    "slug": slug.current,
    speaker,
    youtubeUrl,
    youtubeVideoId,
    description,
    datePreached
  }
`;

export const SERMON_BY_SLUG_QUERY = `
  *[_type == "sermon" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    speaker,
    youtubeUrl,
    youtubeVideoId,
    description,
    datePreached
  }
`;

export const SERMON_SLUGS_QUERY = `
  *[_type == "sermon" && archived != true]{ "slug": slug.current }
`;

/* Used by CRON sync to match existing sermons by YouTube video ID */
export const SERMONS_BY_VIDEO_IDS_QUERY = `
  *[_type == "sermon" && youtubeVideoId in $videoIds] {
    _id,
    name,
    description,
    youtubeVideoId,
    datePreached
  }
`;

export const SERMON_SLUG_EXISTS_QUERY = `
  count(*[_type == "sermon" && slug.current == $slug]) > 0
`;

/* All non-archived sermons with a video ID (for archive detection) */
export const ALL_SYNCED_SERMONS_QUERY = `
  *[_type == "sermon" && defined(youtubeVideoId) && archived != true] {
    _id,
    youtubeVideoId
  }
`;

/* ------------------------------------------------------------------ */
/*  Blog Posts                                                         */
/* ------------------------------------------------------------------ */

export const ALL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(dateWritten desc) {
    name,
    "slug": slug.current,
    content,
    featuredSnippet,
    "imageUrl": image.asset->url,
    image,
    dateWritten,
    featuredOnHome
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    content,
    featuredSnippet,
    "imageUrl": image.asset->url,
    image,
    dateWritten,
    featuredOnHome
  }
`;

export const BLOG_SLUGS_QUERY = `
  *[_type == "blogPost"]{ "slug": slug.current }
`;

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */

export const ALL_EVENTS_QUERY = `
  *[_type == "event"] | order(startTime desc) {
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    image,
    description,
    location,
    startTime,
    endTime,
    registerLink,
    promoVideo,
    isKids,
    isYouth,
    archived
  }
`;

export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    image,
    description,
    location,
    startTime,
    endTime,
    registerLink,
    promoVideo,
    isKids,
    isYouth,
    archived
  }
`;

export const EVENT_SLUGS_QUERY = `
  *[_type == "event"]{ "slug": slug.current }
`;

/* ------------------------------------------------------------------ */
/*  Site Settings                                                      */
/* ------------------------------------------------------------------ */

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    churchName,
    phone,
    email,
    address,
    sundayTime,
    wednesdayTime,
    welcomeVideoId,
    giveUrl,
    facebookUrl,
    youtubeUrl,
    heroImage,
    heroHeading,
    heroSubtext,
    ctaHeading,
    ctaSubtext
  }
`;
