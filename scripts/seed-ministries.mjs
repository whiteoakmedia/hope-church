import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "bb1he81m",
  dataset: "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error("Missing SANITY_API_TOKEN env var");
  process.exit(1);
}

function key() { return crypto.randomUUID().slice(0, 8); }
function blocks(...texts) {
  return texts.map(text => ({
    _type: "block", _key: key(), style: "normal", markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

const docs = [
  {
    _id: "ministry-hope-kids",
    _type: "ministry",
    name: "Hope Kids",
    slug: { _type: "slug", current: "hope-kids" },
    description: blocks(
      "Hope Kids is a vibrant, exciting service designed just for children! Every Sunday morning during our 10am worship service, kids experience age-appropriate Bible teaching, worship, and activities.",
      "Our dedicated team of volunteers creates a safe, fun environment where children can learn about God's love and build lasting friendships.",
      "We use the Learn curriculum from Bible Engagement Project, helping kids dive deeper into the Bible's truths through interactive lessons and engaging content."
    ),
    schedule: "Sundays at 10:00 AM (during main service)",
    order: 1,
  },
  {
    _id: "ministry-prayer",
    _type: "ministry",
    name: "Prayer",
    slug: { _type: "slug", current: "prayer" },
    description: blocks(
      "Prayer is at the heart of everything we do at Hope Christian Church. We believe that prayer is the foundation of our relationship with God and the power behind our ministry.",
      "Our prayer ministry is Spirit-empowered. We gather regularly to seek God's face, intercede for our community, and lift up the needs of our congregation.",
      "We believe in the power of prayer to transform lives, heal the broken, and bring hope to the hopeless. Whether you need prayer or want to pray for others, there is a place for you.",
      "If you have a prayer request, we would love to pray with you and for you. Reach out to us anytime."
    ),
    contactEmail: "pastorjim@hopeag.com",
    order: 2,
  },
  {
    _id: "ministry-knowing-christ",
    _type: "ministry",
    name: "Knowing Christ",
    slug: { _type: "slug", current: "knowing-christ" },
    description: blocks(
      "The most important decision you will ever make is to accept Jesus Christ as your Lord and Savior. This is not about religion — it's about a relationship with the living God who loves you deeply.",
      "No matter where you've been or what you've done, God's grace is available to you right now. The Bible says that if you confess with your mouth that Jesus is Lord and believe in your heart that God raised Him from the dead, you will be saved.",
      "If you've made the decision to follow Christ, or if you'd like to know more, we would love to hear from you and walk alongside you in this journey."
    ),
    contactEmail: "pastorjim@hopeag.com",
    order: 3,
  },
];

async function seed() {
  console.log("Seeding ministry documents...");
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  const result = await tx.commit();
  console.log("Done!", result.transactionId);
  docs.forEach(d => console.log("  -", d._type, d._id));
}

seed().catch(err => { console.error(err.message); process.exit(1); });
