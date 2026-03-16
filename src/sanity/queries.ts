/* ------------------------------------------------------------------ */
/*  Shared Projections                                                */
/* ------------------------------------------------------------------ */

const imageFields = `
  asset->{
    _id,
    url,
    metadata { dimensions, lqip }
  },
  hotspot,
  crop,
  alt
`;

const portableTextField = `[]{ ..., markDefs[]{ ... } }`;

/* ------------------------------------------------------------------ */
/*  Site Settings                                                     */
/* ------------------------------------------------------------------ */

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    churchName,
    tagline,
    missionStatement${portableTextField},
    logo{ ${imageFields} },
    launchDate,
    serviceTimes[]{
      dayOfWeek,
      time,
      label
    },
    email,
    phone,
    address{
      street,
      city,
      state,
      zip
    },
    instagram,
    facebook,
    youtube,
    twitter,
    tiktok,
    values[]{
      title,
      description,
      icon
    },
    navCtaLabel,
    givingLink,
    copyrightText,
    footerTagline,
    denominationText,
    metaTitle,
    metaDescription,
    ogImage{ ${imageFields} }
  }
`;

/* ------------------------------------------------------------------ */
/*  Home Page                                                         */
/* ------------------------------------------------------------------ */

export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0]{
    heroHeading,
    heroSubheading,
    heroImage{ ${imageFields} },
    heroVideoUrl,
    heroCtas[]{
      label,
      link,
      style
    },
    welcomeHeading,
    welcomeBody${portableTextField},
    welcomeImage{ ${imageFields} },
    welcomeCtaLabel,
    welcomeCtaLink,
    galleryImages[]{
      ${imageFields},
      caption
    },
    sections[]{
      sectionType,
      heading,
      body${portableTextField},
      image{ ${imageFields} },
      cta{
        label,
        link
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  About Page                                                        */
/* ------------------------------------------------------------------ */

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]{
    heroHeading,
    heroSubheading,
    heroImage{ ${imageFields} },
    whoWeAreHeading,
    whoWeAreBody${portableTextField},
    whoWeAreImage{ ${imageFields} },
    beliefsHeading,
    beliefs[]{
      title,
      description${portableTextField}
    },
    denominationHeading,
    denominationBody${portableTextField},
    denominationImage{ ${imageFields} },
    showStaff
  }
`;

/* ------------------------------------------------------------------ */
/*  Giving Page                                                       */
/* ------------------------------------------------------------------ */

export const givingPageQuery = /* groq */ `
  *[_type == "givingPage"][0]{
    heroHeading,
    heroSubheading,
    mainHeading,
    mainBody${portableTextField},
    givingLink,
    onlineGivingHeading,
    onlineGivingBody,
    onlineGivingButtonLabel,
    waysToGive[]{
      title,
      description,
      icon
    },
    scriptureText,
    scriptureReference
  }
`;

/* ------------------------------------------------------------------ */
/*  Contact Page                                                      */
/* ------------------------------------------------------------------ */

export const contactPageQuery = /* groq */ `
  *[_type == "contactPage"][0]{
    heroHeading,
    heroSubheading,
    formHeading,
    formSubtitle,
    recipientEmail,
    successMessage,
    quoteText,
    quoteAttribution,
    quoteRole,
    showMap,
    body${portableTextField}
  }
`;

/* ------------------------------------------------------------------ */
/*  Events Page (singleton)                                           */
/* ------------------------------------------------------------------ */

export const eventsPageQuery = /* groq */ `
  *[_type == "eventsPage"][0]{
    heroHeading,
    heroSubheading,
    heroImage{ ${imageFields} },
    ctaHeading,
    ctaBody,
    ctaButtonLabel,
    ctaButtonLink
  }
`;

/* ------------------------------------------------------------------ */
/*  Staff Page (singleton)                                            */
/* ------------------------------------------------------------------ */

export const staffPageQuery = /* groq */ `
  *[_type == "staffPage"][0]{
    heroHeading,
    heroSubheading,
    heroImage{ ${imageFields} },
    ctaHeading,
    ctaBody,
    ctaButtonLabel,
    ctaButtonLink
  }
`;

/* ------------------------------------------------------------------ */
/*  Events                                                            */
/* ------------------------------------------------------------------ */

const eventProjection = `
  _id,
  title,
  "slug": slug.current,
  date,
  endDate,
  timeDisplay,
  location,
  category,
  description${portableTextField},
  image{ ${imageFields} },
  registrationLink,
  featured,
  recurring,
  recurrencePattern
`;

export const eventsQuery = /* groq */ `
  *[_type == "event"] | order(date asc){
    ${eventProjection}
  }
`;

export const upcomingEventsQuery = /* groq */ `
  *[_type == "event" && date >= now()] | order(date asc)[0...6]{
    ${eventProjection}
  }
`;

export const featuredEventsQuery = /* groq */ `
  *[_type == "event" && featured == true] | order(date asc){
    ${eventProjection}
  }
`;

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    ${eventProjection}
  }
`;

export const eventSlugsQuery = `
  *[_type == "event"]{ "slug": slug.current }
`;

/* ------------------------------------------------------------------ */
/*  Sermons                                                           */
/* ------------------------------------------------------------------ */

const sermonProjection = `
  _id,
  title,
  "slug": slug.current,
  preacher->{ _id, name, role, photo{ ${imageFields} } },
  date,
  series,
  scriptureReference,
  description${portableTextField},
  videoUrl,
  "audioFileUrl": audioFile.asset->url,
  audioUrl,
  image{ ${imageFields} },
  order
`;

export const sermonsQuery = /* groq */ `
  *[_type == "sermon"] | order(date desc){
    ${sermonProjection}
  }
`;

export const latestSermonQuery = /* groq */ `
  *[_type == "sermon"] | order(date desc)[0]{
    ${sermonProjection}
  }
`;

export const sermonsBySeriesQuery = /* groq */ `
  *[_type == "sermon" && series == $series] | order(date desc){
    ${sermonProjection}
  }
`;

export const sermonBySlugQuery = `
  *[_type == "sermon" && slug.current == $slug][0] {
    ${sermonProjection}
  }
`;

export const sermonSlugsQuery = `
  *[_type == "sermon"]{ "slug": slug.current }
`;

/* CRON sync helpers */

export const sermonsByVideoIdsQuery = `
  *[_type == "sermon" && videoUrl in $videoIds] {
    _id,
    title,
    description,
    videoUrl,
    date
  }
`;

export const sermonSlugExistsQuery = `
  count(*[_type == "sermon" && slug.current == $slug]) > 0
`;

export const allSyncedSermonsQuery = `
  *[_type == "sermon" && defined(videoUrl)] {
    _id,
    videoUrl
  }
`;

/* ------------------------------------------------------------------ */
/*  Ministries                                                        */
/* ------------------------------------------------------------------ */

export const ministriesQuery = /* groq */ `
  *[_type == "ministry"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    description${portableTextField},
    schedule,
    leader->{ _id, name, role, photo{ ${imageFields} } },
    contactEmail,
    image{ ${imageFields} },
    order
  }
`;

/* ------------------------------------------------------------------ */
/*  Staff                                                             */
/* ------------------------------------------------------------------ */

export const staffQuery = /* groq */ `
  *[_type == "staff"] | order(order asc){
    _id,
    name,
    role,
    email,
    phone,
    photo{ ${imageFields} },
    bio${portableTextField},
    order
  }
`;

/* ------------------------------------------------------------------ */
/*  Blog Posts (Hope Church unique)                                   */
/* ------------------------------------------------------------------ */

export const blogPostsQuery = `
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

export const blogPostBySlugQuery = `
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

export const blogSlugsQuery = `
  *[_type == "blogPost"]{ "slug": slug.current }
`;
