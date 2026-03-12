/**
 * One-time migration script: pushes existing data into Sanity.
 *
 * Usage:
 *   node scripts/migrate-to-sanity.mjs
 *
 * Prerequisites:
 *   - SANITY_AUTH_TOKEN env var with a write token from manage.sanity.io
 *   - npm install @sanity/client (already installed)
 */

import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bb1he81m";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error(
    "❌  Set SANITY_AUTH_TOKEN env var. Get a token at https://www.sanity.io/manage/project/" +
      PROJECT_ID +
      "/api#tokens"
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

/* ------------------------------------------------------------------ */
/*  HTML → Portable Text converter (simplified)                        */
/* ------------------------------------------------------------------ */

function htmlToPortableText(html) {
  const dom = new JSDOM(`<body>${html}</body>`);
  const body = dom.window.document.body;
  const blocks = [];

  function processChildren(parent) {
    const children = [];
    for (const node of parent.childNodes) {
      if (node.nodeType === 3) {
        // text node
        const text = node.textContent;
        if (text.trim()) {
          children.push({ _type: "span", _key: key(), text, marks: [] });
        }
      } else if (node.nodeType === 1) {
        // element
        const tag = node.tagName.toLowerCase();
        if (tag === "strong" || tag === "b") {
          const spans = processChildren(node);
          spans.forEach((s) => s.marks.push("strong"));
          children.push(...spans);
        } else if (tag === "em" || tag === "i") {
          const spans = processChildren(node);
          spans.forEach((s) => s.marks.push("em"));
          children.push(...spans);
        } else if (tag === "a") {
          const spans = processChildren(node);
          const markKey = key();
          spans.forEach((s) => s.marks.push(markKey));
          children.push(...spans);
          // Store annotation info on the spans
          spans._linkAnnotation = {
            _key: markKey,
            _type: "link",
            href: node.getAttribute("href") || "",
          };
        } else {
          children.push(...processChildren(node));
        }
      }
    }
    return children;
  }

  function processElement(el) {
    const tag = el.tagName.toLowerCase();

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const children = processChildren(el);
      if (children.length === 0) return;
      blocks.push({
        _type: "block",
        _key: key(),
        style: tag,
        markDefs: [],
        children:
          children.length > 0
            ? children
            : [{ _type: "span", _key: key(), text: "", marks: [] }],
      });
    } else if (tag === "p") {
      const children = processChildren(el);
      const markDefs = [];
      // Collect link annotations
      collectMarkDefs(children, markDefs);
      blocks.push({
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs,
        children:
          children.length > 0
            ? children
            : [{ _type: "span", _key: key(), text: "", marks: [] }],
      });
    } else if (tag === "blockquote") {
      // Process children of blockquote (usually <p> tags)
      for (const child of el.children) {
        if (child.tagName.toLowerCase() === "p") {
          const children = processChildren(child);
          const markDefs = [];
          collectMarkDefs(children, markDefs);
          blocks.push({
            _type: "block",
            _key: key(),
            style: "blockquote",
            markDefs,
            children:
              children.length > 0
                ? children
                : [{ _type: "span", _key: key(), text: "", marks: [] }],
          });
        }
      }
    } else if (tag === "ul" || tag === "ol") {
      const listItem = tag === "ul" ? "bullet" : "number";
      for (const li of el.children) {
        if (li.tagName.toLowerCase() === "li") {
          const children = processChildren(li);
          const markDefs = [];
          collectMarkDefs(children, markDefs);
          blocks.push({
            _type: "block",
            _key: key(),
            style: "normal",
            listItem,
            level: 1,
            markDefs,
            children:
              children.length > 0
                ? children
                : [{ _type: "span", _key: key(), text: "", marks: [] }],
          });
        }
      }
    }
  }

  function collectMarkDefs(spans, markDefs) {
    if (spans._linkAnnotation) {
      markDefs.push(spans._linkAnnotation);
    }
    for (const span of spans) {
      if (span._linkAnnotation) {
        markDefs.push(span._linkAnnotation);
      }
    }
  }

  for (const child of body.children) {
    processElement(child);
  }

  return blocks;
}

let _keyCounter = 0;
function key() {
  return (++_keyCounter).toString(36).padStart(6, "0");
}

/* ------------------------------------------------------------------ */
/*  Upload image from URL to Sanity                                    */
/* ------------------------------------------------------------------ */

async function uploadImageFromUrl(url) {
  try {
    console.log(`  📸 Uploading image: ${url.slice(0, 80)}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    // Extract filename
    const urlPath = new URL(url).pathname;
    const filename = urlPath.split("/").pop() || "image.jpg";

    const asset = await client.assets.upload("image", buffer, {
      filename: decodeURIComponent(filename),
    });

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(`  ⚠️  Failed to upload image: ${err.message}`);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Migrate Sermons                                                    */
/* ------------------------------------------------------------------ */

const sermons = [
  { name: "Kingdom Economics", slug: "kingdom-economics", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=1fAgDNsoePE", youtubeVideoId: "1fAgDNsoePE", description: "Today marks the beginning of our new series entitled Kingdom Economics. In this first week we define God's definition of true wealth.", datePreached: "2026-03-01T00:00:00.000Z" },
  { name: "A Puff of Wind", slug: "a-puff-of-wind", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=MBM7sshA9NY", youtubeVideoId: "MBM7sshA9NY", description: "God takes our small prayers and does great things. It's ahead to soon to stop praying.", datePreached: "2026-02-15T00:00:00.000Z" },
  { name: "Pray Long", slug: "pray-long", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=h5BUBKN5XD8", youtubeVideoId: "h5BUBKN5XD8", description: "Pastor Jim continues our 40 Day Prayer series challenging us with Biblical examples of those who preserved in prayer till the answer came from heaven.", datePreached: "2026-02-08T00:00:00.000Z" },
  { name: "Dream Big", slug: "dream-big", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=rSv1j_8dUi4", youtubeVideoId: "rSv1j_8dUi4", description: "As we continue our 40 day prayer Challenge, we're excited to see God moving in miracles here at Hope Church.", datePreached: "2026-01-25T00:00:00.000Z" },
  { name: "40 Day Prayer Challenge", slug: "40-day-prayer-challenge", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=oFdk8vJL1R8", youtubeVideoId: "oFdk8vJL1R8", description: "Go home. Lock yourself in your room. Kneel down in the middle of the floor, and with a piece of chalk draw a circle around yourself.", datePreached: "2026-01-18T00:00:00.000Z" },
  { name: "New Year New You", slug: "new-year-new-you", speaker: "Rev Howard Renker", youtubeUrl: "https://www.youtube.com/watch?v=XTMMisGhhGU", youtubeVideoId: "XTMMisGhhGU", description: "Foundational truth for walking in freedom and joy in the presence of the Lord in 2026", datePreached: "2026-01-04T00:00:00.000Z" },
  { name: "What do you see?", slug: "what-do-you-see", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=H5nNP3He4Bo", youtubeVideoId: "H5nNP3He4Bo", description: "The call of the Christian is to go. To be light and salt in a dark and corrupt world.", datePreached: "2025-12-28T00:00:00.000Z" },
  { name: "The Star that Sends Us", slug: "the-star-that-sends-us", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=nNYCs9YvEjA", youtubeVideoId: "nNYCs9YvEjA", description: "The call of the Christian is to go. To be light and salt in a dark and corrupt world.", datePreached: "2025-12-21T00:00:00.000Z" },
  { name: "Led By The Star", slug: "led-by-the-star", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=t3gBLXMz2Qk", youtubeVideoId: "t3gBLXMz2Qk", description: "Our Christmas Journey theme, Led By the Star. Learning to trust the leading of the Holy Spirit.", datePreached: "2025-11-30T00:00:00.000Z" },
  { name: "Gratitude (week 3)", slug: "gratitude-week-3", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=DkU5VxbjK78", youtubeVideoId: "DkU5VxbjK78", description: "In our final message in this mini series on gratitude, Pastor Jim takes an in-depth look at how gratitude transforms our lives.", datePreached: "2025-11-23T00:00:00.000Z" },
  { name: "Gratitude Imitating Christ", slug: "gratitude-imitating-christ", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=7O3AtKldEkY", youtubeVideoId: "7O3AtKldEkY", description: "As we study the life of Christ, we see that gratitude is at the heart of his DNA.", datePreached: "2025-11-16T00:00:00.000Z" },
  { name: "Gratitude (Part 1)", slug: "gratitude-part-1", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=5adw3jfkUkI", youtubeVideoId: "5adw3jfkUkI", description: "We're starting a three part series on developing a lifestyle DNA of gratitude.", datePreached: "2025-11-09T00:00:00.000Z" },
  { name: "The Call of a Watchman", slug: "the-call-of-a-watchman", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=V67zKfBn7hg", youtubeVideoId: "V67zKfBn7hg", description: "Pastor Jim outlines 5 traits of a true watchman. Jesus repeatedly challenged us to watch and pray.", datePreached: "2025-11-02T00:00:00.000Z" },
  { name: "Stir Up The Gift in You", slug: "stir-up-the-gift-in-you", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=rdq5Dzdrvl8", youtubeVideoId: "rdq5Dzdrvl8", description: "As we come to the conclusion of the book of Acts, we are challenged to stir up the gift that God has placed in us!", datePreached: "2025-10-26T00:00:00.000Z" },
  { name: "Living a supernatural life Acts 28", slug: "living-a-supernatural-life-acts-28", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=q_wpM9_oCiY", youtubeVideoId: "q_wpM9_oCiY", description: "The book of Acts pictures the church that Christ is building, a supernatural, Spirit empowered body.", datePreached: "2025-10-19T00:00:00.000Z" },
  { name: "Victory in the Storm Acts 27", slug: "victory-in-the-storm-acts-27", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=mKFnPTC33PA", youtubeVideoId: "mKFnPTC33PA", description: "All of us have been in a storm at some point. Financial, relational, physical storms can challenge the word God has given us.", datePreached: "2025-10-12T00:00:00.000Z" },
  { name: "Called to be", slug: "called-to-be", speaker: "Denny Seler", youtubeUrl: "https://www.youtube.com/watch?v=3OFi-kDUKH4", youtubeVideoId: "3OFi-kDUKH4", description: "Missionary Denny Seler highlights Gods call on each of our lives.", datePreached: "2025-10-05T00:00:00.000Z" },
  { name: "Power in Sharing my faith", slug: "power-in-sharing-my-faith", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=8m75hj1cFSk", youtubeVideoId: "8m75hj1cFSk", description: "Practical steps in becoming effective in telling others about Gods greatest gift.", datePreached: "2025-09-28T00:00:00.000Z" },
  { name: "Procrastination Acts 24", slug: "procrastination-acts-24", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=i8vO1YQsQXU", youtubeVideoId: "i8vO1YQsQXU", description: "Billy Graham was once asked what the most surprising thing about life was. His answer: its brevity.", datePreached: "2025-09-21T00:00:00.000Z" },
  { name: "A Clear Conscious", slug: "a-clear-conscious", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=tCoY2UsFWkw", youtubeVideoId: "tCoY2UsFWkw", description: "Acts 23:1 Paul declares his conscience is clear. The value and the power of a good conscience.", datePreached: "2025-09-07T00:00:00.000Z" },
  { name: "Chosen", slug: "chosen", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=brgqSLaqucI", youtubeVideoId: "brgqSLaqucI", description: "Paul shares his powerful testimony of his encounter with Jesus in Jerusalem.", datePreached: "2025-08-24T00:00:00.000Z" },
  { name: "God's Goodness in Healing", slug: "gods-goodness-in-healing", speaker: "Timothy Akojenu", youtubeUrl: "https://www.youtube.com/watch?v=jwCOKpkmJ0E", youtubeVideoId: "jwCOKpkmJ0E", description: "Healing is not about us, but healing IS for us! From John 9.", datePreached: "2025-08-17T00:00:00.000Z" },
  { name: "How to Encourage yourself in the Lord", slug: "how-to-encourage-yourself-in-the-lord", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=19g2vTZMKPA", youtubeVideoId: "19g2vTZMKPA", description: "Acts 21 - the challenges of legalism and how Paul encouraged himself in the Lord.", datePreached: "2025-07-27T00:00:00.000Z" },
  { name: "The gift of Prophecy in the New Testament Church", slug: "the-gift-of-prophecy-in-the-new-testament-church", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=0BmAGmD5ekQ", youtubeVideoId: "0BmAGmD5ekQ", description: "The New Testament Church was alive and empowered by the Spirit with miracles and gifts.", datePreached: "2025-07-20T00:00:00.000Z" },
  { name: "20 20 Vision of the Church", slug: "20-20-vision-of-the-church", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=M_T89kUuIk0", youtubeVideoId: "M_T89kUuIk0", description: "What mattered most to the early church? For our vision to be 20 20 we must embrace their priorities.", datePreached: "2025-07-13T00:00:00.000Z" },
  { name: "Raising our Expectations (Part 2)", slug: "raising-our-expectations-part-2", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=Avd4-wyyb6I", youtubeVideoId: "Avd4-wyyb6I", description: "Part 2 continues to focus on taking Gods word at face value.", datePreached: "2025-07-06T00:00:00.000Z" },
  { name: "Raising our Expectations Acts 20", slug: "raising-our-expectations-acts-20", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=1KdhbGPklI0", youtubeVideoId: "1KdhbGPklI0", description: "Mighty miracles, raising the dead, are all powerful blessings of our inheritance in grace.", datePreached: "2025-06-29T00:00:00.000Z" },
  { name: "Revival and Riots", slug: "revival-and-riots", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=X7vrdcLIXnM", youtubeVideoId: "X7vrdcLIXnM", description: "Awakening turns people to Christ through signs wonders and miracles.", datePreached: "2025-06-22T00:00:00.000Z" },
  { name: "Sharing our faith living in the power of the Spirit of God", slug: "sharing-our-faith-living-in-the-power-of-the-spirit-of-god", speaker: "Don Butera", youtubeUrl: "https://www.youtube.com/watch?v=Z8wY7ZZOI40", youtubeVideoId: "Z8wY7ZZOI40", description: "Don shares the amazing work of the Lord in Bali Indonesia.", datePreached: "2025-06-15T00:00:00.000Z" },
  { name: "Awakening", slug: "awakening", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=2JpsEZpXjo8", youtubeVideoId: "2JpsEZpXjo8", description: "Today's message focuses on awakening and the Spirit Empowered believer.", datePreached: "2025-06-08T00:00:00.000Z" },
  { name: "Increase", slug: "increase", speaker: "Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=mcAo6-Tus0c", youtubeVideoId: "mcAo6-Tus0c", description: "Acts 19 challenges every believer to remain teachable and spiritually hungry.", datePreached: "2025-06-01T00:00:00.000Z" },
  { name: "The Power of Teamwork (Acts 18)", slug: "the-power-of-teamwork-acts-18", speaker: "Pastor Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=wnrz1ZCOnq4", youtubeVideoId: "wnrz1ZCOnq4", description: "Acts 18 Paul arrives at Corinth, and his team surrounds him with resources.", datePreached: "2025-05-18T00:00:00.000Z" },
  { name: "Come Home (Part 3)", slug: "come-home-part-3", speaker: "Mike & Tina Hook & Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=i5xaIAfG9jo", youtubeVideoId: "i5xaIAfG9jo", description: "Mike & Tina Hook are our missionaries to Scotland. Pastor Jim continues Come Home series.", datePreached: "2025-05-04T00:00:00.000Z" },
  { name: "Come Home (part 2)", slug: "come-home-part-2", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=Pr7NTeicw2g", youtubeVideoId: "Pr7NTeicw2g", description: "Many people know where they want to be, but find it difficult to get there.", datePreached: "2025-04-27T00:00:00.000Z" },
  { name: "Come Home", slug: "come-home", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=dhCPRRr5Do4", youtubeVideoId: "dhCPRRr5Do4", description: "It's never too late to come home. No matter how many bad decisions you've made.", datePreached: "2025-04-20T00:00:00.000Z" },
  { name: "Turning the World Upside Down", slug: "turning-the-world-upside-down", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=tBMd9kLvgSo", youtubeVideoId: "tBMd9kLvgSo", description: "The early church gives us the clearest picture of the Holy Spirit empowering believers.", datePreached: "2025-04-13T00:00:00.000Z" },
  { name: "The Power of Praise and Prayer", slug: "the-power-of-praise-and-prayer", speaker: "Pastor Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=ukzpUUhIXCo", youtubeVideoId: "ukzpUUhIXCo", description: "Prayer and praise changes us, our hearts and our situation.", datePreached: "2025-04-06T00:00:00.000Z" },
  { name: "The Wind of the Holy Spirit", slug: "the-wind-of-the-holy-spirit", speaker: "Pastor Eddie Cardona", youtubeUrl: "https://www.youtube.com/watch?v=-pqg0aSye1s", youtubeVideoId: "-pqg0aSye1s", description: "As the Holy Spirit breathed life into the bones in the valley, God breathes into the dry places in our lives.", datePreached: "2025-03-30T00:00:00.000Z" },
  { name: "How God Leads Us", slug: "how-god-leads-us", speaker: "Pastor Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=W9_wDhlUTGo", youtubeVideoId: "W9_wDhlUTGo", description: "Acts 16 gives us a clear understanding of Gods guidance and direction.", datePreached: "2025-03-16T00:00:00.000Z" },
  { name: "Adult and Teen Challenge Connecticut", slug: "adult-and-teen-challenge-connecticut", speaker: "Wayne Gallagher", youtubeUrl: "https://www.youtube.com/watch?v=W0UIOo3rFSE", youtubeVideoId: "W0UIOo3rFSE", description: "", datePreached: "2025-03-09T00:00:00.000Z" },
  { name: "Across Nigeria", slug: "across-nigeria", speaker: "Brad Brandon", youtubeUrl: "https://www.youtube.com/watch?v=WKv8Ccz7JhY", youtubeVideoId: "WKv8Ccz7JhY", description: "As a community, we are devoted to seeing Nigeria and the surrounding regions transformed.", datePreached: "2025-03-02T00:00:00.000Z" },
  { name: "When Gods Kids Disagree", slug: "when-gods-kids-disagree", speaker: "Pastor Jim", youtubeUrl: "https://www.youtube.com/watch?v=Gi0sIJERsdE", youtubeVideoId: "Gi0sIJERsdE", description: "Paul and Barnabas experienced a strong disagreement. Today's message focuses on maintaining unity.", datePreached: "2025-02-23T00:00:00.000Z" },
  { name: "Am I Really Saved?", slug: "am-i-really-saved", speaker: "Pastor Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=E8kgZeSgGyU", youtubeVideoId: "E8kgZeSgGyU", description: "The early Church experienced their first challenge with false doctrine. Text Acts 15.", datePreached: "2025-02-16T00:00:00.000Z" },
  { name: "Amazing Grace", slug: "amazing-grace", speaker: "Rev Howard Renker", youtubeUrl: "https://www.youtube.com/watch?v=L7YO8gObS1c", youtubeVideoId: "L7YO8gObS1c", description: "Today's message focuses on receiving and multiplying God's grace in our lives.", datePreached: "2025-01-26T00:00:00.000Z" },
  { name: "The Power of the Gospel", slug: "placeholder-title", speaker: "Pastor Jim Detweiler", youtubeUrl: "https://www.youtube.com/watch?v=99dLvhL2wBk", youtubeVideoId: "99dLvhL2wBk", description: "Pastor Jim highlights how the Gospel brings hope, redemption, and lasting change.", datePreached: "2024-12-08T00:00:00.000Z" },
];

async function migrateSermons() {
  console.log(`\n📖 Migrating ${sermons.length} sermons...`);
  const transaction = client.transaction();

  for (const s of sermons) {
    transaction.createOrReplace({
      _id: `sermon-${s.slug}`,
      _type: "sermon",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      speaker: s.speaker,
      youtubeUrl: s.youtubeUrl,
      youtubeVideoId: s.youtubeVideoId,
      description: s.description,
      datePreached: s.datePreached,
    });
  }

  await transaction.commit();
  console.log(`✅ ${sermons.length} sermons migrated.`);
}

/* ------------------------------------------------------------------ */
/*  Migrate Events                                                     */
/* ------------------------------------------------------------------ */

const events = [
  { name: "NEW YEARS EVE BAPTISM 2026", slug: "new-years-eve-baptism-2026", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6931fa29a456bf4d33db035f_Water%20baptism%20dec%2031.jpg", description: "Join us this New Year's Eve for a powerful night of worship, celebration and water baptism.", location: "Hope Church Sanctuary", startTime: "2026-01-01T00:00:00.000Z", registerLink: "https://onrealm.org/", isKids: false, isYouth: false, archived: false },
  { name: "North Haven Annual Prayer Breakfast", slug: "north-haven-annual-prayer-breakfast-2", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67dc28cd136f9c25e6dc2f83_Prayer%20breakfast%2025.jpg", description: "Every Spring we gather as a community to give thanks and pray for our town.", location: "Clarion Inn 201 Washington Ave North Haven CT", startTime: "2025-05-01T00:00:00.000Z", registerLink: "https://onrealm.org/", isKids: false, isYouth: false, archived: false },
  { name: "Come Home (Sermon series starting Easter Sunday)", slug: "come-home-sermon-series-starting-easter-sunday", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67d31315451a876c9b633409_1920x1080%20Come%20Home.jpg", description: "Come Home This Easter! Starting April 20, 2025.", location: "Sanctuary", startTime: "2025-04-20T00:00:00.000Z", endTime: "2025-05-18T00:00:00.000Z", isKids: false, isYouth: false, archived: false },
  { name: "Easter Water Baptism", slug: "easter-water-baptism", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67ca0b8553bee51d0f96aa08_water%20baptism.webp", description: "Celebrate new life in Christ this Resurrection Sunday.", location: "Hope Church", startTime: "2025-04-20T00:00:00.000Z", registerLink: "https://onrealm.org/", isKids: false, isYouth: false, archived: false },
  { name: "King of Kings Movie Screening", slug: "kin-of-kings-movie-screening", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67dc31f5d669065d5eb9c320_King%20of%20Kings%20movie.jpg", description: "A father tells his son the greatest story ever told.", location: "Cinemark Theater North Haven", startTime: "2025-04-13T00:00:00.000Z", registerLink: "https://onrealm.org/", promoVideo: "https://www.youtube.com/watch?v=HDhet3EVRac", isKids: true, isYouth: false, archived: false },
  { name: "Biblical Worldview Workshop", slug: "biblical-worldview-workshop", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67b4e84c0a73d5a4016b31a2_Biblical%20Worldview%20Workshop.jpg", description: "The Family Research Council's Biblical Worldview Workshop", location: "Hope Christian Church 211 Montowese Ave North Haven CT 06473", startTime: "2025-03-23T22:30:00.000Z", endTime: "2025-03-24T21:00:00.000Z", isKids: false, isYouth: false, archived: true },
  { name: "Men's Event", slug: "mens-event", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254988657d87ffff399fd8_mens-ministry-beard-guy-title.jpg", description: "Men's Ministry will biblically train and equip our men to be spiritual leaders.", location: "The Sanctuary", startTime: "2025-01-08T00:00:00.000Z", isKids: false, isYouth: false, archived: false },
  { name: "Next Steps 101", slug: "next-steps-101", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6718fcb3e4cdde5fa54757b1_NSAG.jpg", description: "Next Steps digs deep into Hope's Vision and values.", location: "The Gathering Room", startTime: "2024-12-14T00:00:00.000Z", registerLink: "https://onrealm.org/", isKids: false, isYouth: false, archived: false },
  { name: "Discover Membership 101", slug: "discover-membership-101", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/6718fbef280eb3d03e63e6ca_Discover.jpg", description: "Make your coffee in the cafe and join us in the Gathering room. Learn about Hope's vision.", location: "The Gathering Room", startTime: "2024-11-09T00:00:00.000Z", registerLink: "https://onrealm.org/", isKids: false, isYouth: false, archived: false },
];

async function migrateEvents() {
  console.log(`\n📅 Migrating ${events.length} events...`);

  for (const e of events) {
    const image = await uploadImageFromUrl(e.imageUrl);

    const doc = {
      _id: `event-${e.slug}`,
      _type: "event",
      name: e.name,
      slug: { _type: "slug", current: e.slug },
      description: e.description,
      location: e.location,
      startTime: e.startTime,
      isKids: e.isKids,
      isYouth: e.isYouth,
      archived: e.archived,
    };

    if (e.endTime) doc.endTime = e.endTime;
    if (e.registerLink) doc.registerLink = e.registerLink;
    if (e.promoVideo) doc.promoVideo = e.promoVideo;
    if (image) doc.image = image;

    await client.createOrReplace(doc);
    console.log(`  ✅ ${e.name}`);
  }
  console.log(`✅ ${events.length} events migrated.`);
}

/* ------------------------------------------------------------------ */
/*  Migrate Blog Posts                                                 */
/* ------------------------------------------------------------------ */

const blogPosts = [
  { name: "Embracing Faith in Challenging Times", slug: "embracing-faith-in-challenging-times", featuredSnippet: "Life is filled with challenges that can test our faith. Whether it's a health crisis, a financial setback, or the loss of a loved one, these difficult moments can shake us to our core. But it's during these times that our faith can become our greatest source of strength.", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254c11e894d7c7887a9ff5_image10.jpeg", dateWritten: "2023-10-20T00:00:00.000Z", featuredOnHome: true, content: `<h2>Finding Strength in Scripture</h2><p>Life is filled with challenges that can test our faith. Whether it's a health crisis, a financial setback, or the loss of a loved one, these difficult moments can shake us to our core. But it's during these times that our faith can become our greatest source of strength.</p><p>The Bible is full of stories of people who faced incredible adversity and found their strength in God. Consider the story of Job, who lost everything yet remained faithful. Or think about David, who faced Goliath with nothing but a sling and his trust in God.</p><blockquote><p>"I can do all things through Christ who strengthens me." — Philippians 4:13</p></blockquote><p>When we immerse ourselves in Scripture, we find promises that anchor our souls. God's Word reminds us that He is with us in every trial and that His plans for us are good, even when circumstances suggest otherwise.</p><h2>Practical Steps for Embracing Faith</h2><p>Embracing faith during challenging times doesn't happen automatically. It requires intentional effort and practice. Here are some practical steps to help you strengthen your faith when life gets tough:</p><ul><li><strong>Daily Prayer:</strong> Set aside time each day to talk to God. Be honest about your struggles and ask for His guidance and strength.</li><li><strong>Scripture Reading:</strong> Make it a habit to read the Bible daily. Focus on passages that speak to God's faithfulness and promises.</li><li><strong>Community Support:</strong> Surround yourself with fellow believers who can encourage you, pray with you, and walk alongside you through difficult seasons.</li><li><strong>Worship:</strong> Even when you don't feel like it, choose to worship. Worship shifts our focus from our problems to God's power.</li><li><strong>Journaling:</strong> Write down your prayers, thoughts, and the ways you see God working in your life. Looking back at these entries can strengthen your faith over time.</li></ul><p>Remember, faith is not the absence of doubt. It's choosing to trust God even when we can't see the full picture. Every challenge is an opportunity to deepen our relationship with Him and to witness His faithfulness firsthand.</p>` },
  { name: "Navigating Grief with Faith", slug: "navigating-grief-with-faith", featuredSnippet: "Grief is a natural response to loss. It can feel overwhelming and isolating, but as believers, we have a hope that sustains us even in the darkest valleys.", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254c11e894d7c7887a9fe9_image8.jpeg", dateWritten: "2023-10-10T00:00:00.000Z", featuredOnHome: true, content: `<h2>Understanding Grief Through a Biblical Lens</h2><p>Grief is a natural response to loss. It can feel overwhelming and isolating, but as believers, we have a hope that sustains us even in the darkest valleys. The Bible doesn't shy away from grief — it acknowledges it, validates it, and offers comfort through it.</p><p>Jesus Himself wept at the tomb of Lazarus, showing us that grief is not a sign of weak faith. It is a deeply human experience that even our Savior shared in.</p><blockquote><p>"Blessed are those who mourn, for they shall be comforted." — Matthew 5:4</p></blockquote><h2>Steps for Walking Through Grief</h2><p>Walking through grief is a journey, not a destination. Here are ways to navigate this difficult season with faith:</p><ul><li><strong>Allow Yourself to Grieve:</strong> Don't suppress your emotions. God created us to feel, and He is near to the brokenhearted.</li><li><strong>Lean on Your Church Family:</strong> Let others carry your burdens with you. The body of Christ is designed for mutual support.</li><li><strong>Hold Onto Hope:</strong> Remind yourself of the promises of eternal life and the resurrection. Death is not the end for those who believe.</li><li><strong>Seek Professional Help:</strong> There is no shame in seeking the help of a counselor or therapist who can guide you through the grieving process.</li></ul><p>God is close to the brokenhearted and saves those who are crushed in spirit. In your grief, lean into Him and let His love carry you through.</p>` },
  { name: "The Power of Community", slug: "the-power-of-community", featuredSnippet: "Community plays a crucial role in our spiritual lives. Being part of a faith community provides support, accountability, and encouragement that helps us grow in our walk with God.", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254c11e894d7c7887a9fef_image10.jpeg", dateWritten: "2023-10-05T00:00:00.000Z", featuredOnHome: false, content: `<h2>Why Community Matters</h2><p>Community plays a crucial role in our spiritual lives. Being part of a faith community provides support, accountability, and encouragement that helps us grow in our walk with God. The early church modeled this beautifully, gathering together daily for fellowship, breaking of bread, and prayer.</p><blockquote><p>"And let us consider how to stir one another up to love and good works, not neglecting to meet together." — Hebrews 10:24-25</p></blockquote><h2>Building Meaningful Connections</h2><p>True community goes beyond surface-level interactions. It requires vulnerability, commitment, and intentional investment in one another's lives. Here are ways to build deeper connections within your faith community:</p><ul><li><strong>Join a Small Group:</strong> Small groups provide an intimate setting for sharing, prayer, and mutual encouragement.</li><li><strong>Serve Together:</strong> Working alongside others in ministry creates bonds that last and gives purpose to our faith.</li><li><strong>Be Vulnerable:</strong> Share your struggles and victories. Authentic relationships are built on honesty and trust.</li><li><strong>Pray for One Another:</strong> Commit to praying regularly for the members of your community. Intercessory prayer strengthens bonds and invites God's work.</li></ul><p>We were never meant to walk this journey of faith alone. Together, we are the body of Christ, each part essential and valued.</p>` },
  { name: "Finding Peace in Prayer", slug: "finding-peace-in-prayer", featuredSnippet: "In our fast-paced world, finding moments of peace can be challenging. Yet prayer offers us a direct line to the Creator of the universe.", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254c11e894d7c7887a9ff2_image5.jpeg", dateWritten: "2023-10-01T00:00:00.000Z", featuredOnHome: true, content: `<h2>The Gift of Prayer</h2><p>In our fast-paced world, finding moments of peace can be challenging. Yet prayer offers us a direct line to the Creator of the universe, a place where we can pour out our hearts and receive His peace that surpasses all understanding.</p><p>Prayer is not just about asking God for things. It is about building a relationship with Him, aligning our hearts with His will, and finding rest in His presence.</p><blockquote><p>"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:6-7</p></blockquote><h2>Developing a Prayer Life</h2><p>A consistent prayer life doesn't happen overnight. Like any relationship, it takes time and intentional effort. Consider these approaches to deepening your prayer life:</p><ul><li><strong>Set a Specific Time:</strong> Choose a regular time each day for prayer. Consistency helps build the habit.</li><li><strong>Find a Quiet Place:</strong> Jesus often withdrew to quiet places to pray. Find a spot where you can focus without distractions.</li><li><strong>Use Scripture:</strong> Praying the Scriptures can guide your prayers and align them with God's Word.</li><li><strong>Listen:</strong> Prayer is a two-way conversation. Take time to be still and listen for God's voice.</li><li><strong>Keep a Prayer Journal:</strong> Record your prayers and God's answers. This builds faith as you see His faithfulness over time.</li></ul><p>Prayer is the foundation of our relationship with God. As we spend time in His presence, we are transformed and filled with a peace that the world cannot give.</p>` },
  { name: "The Importance of Forgiveness", slug: "the-importance-of-forgiveness", featuredSnippet: "Forgiveness is a powerful act that can free us from the chains of bitterness and resentment. It is at the very heart of the Gospel.", imageUrl: "https://cdn.prod.website-files.com/66f355eb62b948b556dc6400/67254c11e894d7c7887a9ff9_image5.jpeg", dateWritten: "2023-10-15T00:00:00.000Z", featuredOnHome: false, content: `<h2>The Heart of Forgiveness</h2><p>Forgiveness is a powerful act that can free us from the chains of bitterness and resentment. It is at the very heart of the Gospel — God sent His Son to die for us so that we might be forgiven and reconciled to Him.</p><p>Yet forgiveness is often one of the hardest things we are called to do. It requires us to release our right to revenge and to trust God with the outcome.</p><blockquote><p>"Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you." — Colossians 3:13</p></blockquote><h2>The Freedom of Letting Go</h2><p>Unforgiveness is like drinking poison and expecting the other person to get sick. It harms us far more than it harms the person we refuse to forgive. Here are steps toward embracing forgiveness:</p><ul><li><strong>Acknowledge the Pain:</strong> Don't minimize what happened. Recognize the hurt and bring it before God.</li><li><strong>Choose to Forgive:</strong> Forgiveness is a decision, not a feeling. Choose to release the offender, trusting God to bring justice.</li><li><strong>Pray for the Offender:</strong> This is one of the most challenging but transformative steps. Praying for those who have hurt us softens our hearts.</li><li><strong>Set Boundaries:</strong> Forgiveness does not mean allowing continued harm. You can forgive and still set healthy boundaries.</li><li><strong>Seek Healing:</strong> Allow God to heal the wounds. This may take time, and that is okay. His healing is thorough and complete.</li></ul><p>When we forgive, we reflect the character of Christ and experience the freedom He purchased for us on the cross.</p>` },
];

async function migrateBlogPosts() {
  console.log(`\n✍️  Migrating ${blogPosts.length} blog posts...`);

  for (const p of blogPosts) {
    const image = await uploadImageFromUrl(p.imageUrl);
    const content = htmlToPortableText(p.content);

    const doc = {
      _id: `blogPost-${p.slug}`,
      _type: "blogPost",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      content,
      featuredSnippet: p.featuredSnippet,
      dateWritten: p.dateWritten,
      featuredOnHome: p.featuredOnHome,
    };

    if (image) doc.image = image;

    await client.createOrReplace(doc);
    console.log(`  ✅ ${p.name}`);
  }
  console.log(`✅ ${blogPosts.length} blog posts migrated.`);
}

/* ------------------------------------------------------------------ */
/*  Create Site Settings                                               */
/* ------------------------------------------------------------------ */

async function createSiteSettings() {
  console.log(`\n⚙️  Creating site settings...`);

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    churchName: "Hope Christian Church",
    phone: "(203) 234-7328",
    email: "",
    address: "211 Montowese Ave, North Haven, CT 06473",
    sundayTime: "10:00 AM",
    wednesdayTime: "7:00 PM",
    welcomeVideoId: "oMIh5wfADZg",
    giveUrl: "https://onrealm.org/HopeChristianCh/give/now",
    facebookUrl: "https://www.facebook.com/Hopeag",
    youtubeUrl: "https://youtube.com/@hopechristianct",
    heroHeading: "Join Us for Service!",
    heroSubtext:
      "We gather each Sunday at 10am & Wednesdays at 7pm. There is a place here for everyone!",
    ctaHeading: "We'd Love to Meet You",
    ctaSubtext:
      "Whether you are new to faith or have been walking with God for years, there is a place for you at Hope Christian Church. Come as you are and discover a community that feels like family.",
  });

  console.log(`✅ Site settings created.`);
}

/* ------------------------------------------------------------------ */
/*  Run All Migrations                                                 */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("🚀 Starting Sanity data migration...");
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Dataset: ${DATASET}\n`);

  await migrateSermons();
  await migrateEvents();
  await migrateBlogPosts();
  await createSiteSettings();

  console.log("\n🎉 Migration complete!");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
