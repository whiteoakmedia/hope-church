export interface ChurchEvent {
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
  registerLink?: string;
  promoVideo?: string;
  isKids: boolean;
  isYouth: boolean;
  archived: boolean;
}

/** An event is considered past if its end date (or start date) has passed. */
export function isEventPast(event: ChurchEvent): boolean {
  const cutoff = event.endTime ?? event.startTime;
  return new Date(cutoff) < new Date();
}

/** Upcoming events: not archived and not past, sorted soonest-first. */
export function getUpcomingEvents(): ChurchEvent[] {
  return events
    .filter((e) => !e.archived && !isEventPast(e))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
}

/** Past events: archived or date has passed, sorted most-recent-first. */
export function getPastEvents(): ChurchEvent[] {
  return events
    .filter((e) => e.archived || isEventPast(e))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
}

export const events: ChurchEvent[] = [
  {
    name: "NEW YEARS EVE BAPTISM 2026",
    slug: "new-years-eve-baptism-2026",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6931fa29a456bf4d33db035f_Water%20baptism%20dec%2031.jpg",
    description:
      "Join us this New Year's Eve for a powerful night of worship, celebration and water baptism.",
    location: "Hope Church Sanctuary",
    startTime: "2026-01-01T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "North Haven Annual Prayer Breakfast",
    slug: "north-haven-annual-prayer-breakfast-2",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67dc28cd136f9c25e6dc2f83_Prayer%20breakfast%2025.jpg",
    description:
      "Every Spring we gather as a community to give thanks and pray for our town.",
    location: "Clarion Inn 201 Washington Ave North Haven CT",
    startTime: "2025-05-01T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "Come Home (Sermon series starting Easter Sunday)",
    slug: "come-home-sermon-series-starting-easter-sunday",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67d31315451a876c9b633409_1920x1080%20Come%20Home.jpg",
    description: "Come Home This Easter! Starting April 20, 2025.",
    location: "Sanctuary",
    startTime: "2025-04-20T00:00:00.000Z",
    endTime: "2025-05-18T00:00:00.000Z",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "Easter Water Baptism",
    slug: "easter-water-baptism",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67ca0b8553bee51d0f96aa08_water%20baptism.webp",
    description:
      "Celebrate new life in Christ this Resurrection Sunday.",
    location: "Hope Church",
    startTime: "2025-04-20T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "King of Kings Movie Screening",
    slug: "kin-of-kings-movie-screening",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67dc31f5d669065d5eb9c320_King%20of%20Kings%20movie.jpg",
    description:
      "A father tells his son the greatest story ever told.",
    location: "Cinemark Theater North Haven",
    startTime: "2025-04-13T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    promoVideo: "https://www.youtube.com/watch?v=HDhet3EVRac",
    isKids: true,
    isYouth: false,
    archived: false,
  },
  {
    name: "Biblical Worldview Workshop",
    slug: "biblical-worldview-workshop",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67b4e84c0a73d5a4016b31a2_Biblical%20Worldview%20Workshop.jpg",
    description:
      "The Family Research Council's Biblical Worldview Workshop",
    location:
      "Hope Christian Church 211 Montowese Ave North Haven CT 06473",
    startTime: "2025-03-23T22:30:00.000Z",
    endTime: "2025-03-24T21:00:00.000Z",
    isKids: false,
    isYouth: false,
    archived: true,
  },
  {
    name: "Men's Event",
    slug: "mens-event",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254988657d87ffff399fd8_mens-ministry-beard-guy-title.jpg",
    description:
      "Men's Ministry will biblically train and equip our men to be spiritual leaders.",
    location: "The Sanctuary",
    startTime: "2025-01-08T00:00:00.000Z",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "Next Steps 101",
    slug: "next-steps-101",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6718fcb3e4cdde5fa54757b1_NSAG.jpg",
    description:
      "Next Steps digs deep into Hope's Vision and values.",
    location: "The Gathering Room",
    startTime: "2024-12-14T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    isKids: false,
    isYouth: false,
    archived: false,
  },
  {
    name: "Discover Membership 101",
    slug: "discover-membership-101",
    imageUrl:
      "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6718fbef280eb3d03e63e6ca_Discover.jpg",
    description:
      "Make your coffee in the cafe and join us in the Gathering room. Learn about Hope's vision.",
    location: "The Gathering Room",
    startTime: "2024-11-09T00:00:00.000Z",
    registerLink: "https://onrealm.org/",
    isKids: false,
    isYouth: false,
    archived: false,
  },
];
