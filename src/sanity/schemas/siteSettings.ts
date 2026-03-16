import { defineType, defineField, defineArrayMember } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social Links" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // --- General ---
    defineField({
      name: "churchName",
      title: "Church Name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "array",
      of: [{ type: "block" }],
      group: "general",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      group: "general",
    }),
    defineField({
      name: "launchDate",
      title: "Launch / Countdown Date",
      description:
        "Optional — used for church plants or upcoming launch countdowns.",
      type: "datetime",
      group: "general",
    }),
    defineField({
      name: "serviceTimes",
      title: "Service Times",
      type: "array",
      group: "general",
      of: [
        defineArrayMember({
          type: "object",
          name: "serviceTime",
          fields: [
            defineField({
              name: "dayOfWeek",
              title: "Day of Week",
              type: "string",
              options: {
                list: [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              description: 'e.g. "Sunday Morning", "Wednesday Night"',
              type: "string",
            }),
          ],
          preview: {
            select: {
              day: "dayOfWeek",
              time: "time",
              label: "label",
            },
            prepare({ day, time, label }) {
              return {
                title: label || `${day} Service`,
                subtitle: `${day} at ${time}`,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "values",
      title: "Core Values",
      description:
        "Shared core values displayed across multiple pages (home, about, etc.).",
      type: "array",
      group: "general",
      of: [
        defineArrayMember({
          type: "object",
          name: "coreValue",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "icon",
              title: "Icon",
              description:
                "Icon name or identifier used by the frontend theme.",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
    }),
    defineField({
      name: "navCtaLabel",
      title: "Navigation CTA Label",
      description:
        'The call-to-action button text in the site header, e.g. "Get Connected".',
      type: "string",
      group: "general",
    }),

    // --- Contact ---
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "street", title: "Street", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "Zip", type: "string" }),
      ],
    }),

    // --- Social ---
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "youtube",
      title: "YouTube URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "twitter",
      title: "Twitter / X URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "givingLink",
      title: "Online Giving Link",
      type: "url",
      group: "social",
    }),

    // --- Footer ---
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "denominationText",
      title: "Denomination / Affiliation Text",
      description:
        'Displayed in the footer, e.g. "A ministry of The Mission Church, Assemblies of God".',
      type: "string",
      group: "footer",
    }),

    // --- SEO ---
    defineField({
      name: "metaTitle",
      title: "Default Meta Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "metaDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
