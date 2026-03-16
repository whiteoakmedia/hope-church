import { defineType, defineField, defineArrayMember } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "welcome", title: "Welcome / Intro" },
    { name: "gallery", title: "Gallery" },
    { name: "sections", title: "Sections" },
  ],
  fields: [
    // --- Hero ---
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Hero Background Video URL",
      description: "Optional — overrides background image when provided.",
      type: "url",
      group: "hero",
    }),
    defineField({
      name: "heroCtas",
      title: "Hero CTA Buttons",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "object",
          name: "ctaButton",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Outline", value: "outline" },
                ],
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "link" },
          },
        }),
      ],
    }),

    // --- Welcome / Intro ---
    defineField({
      name: "welcomeHeading",
      title: "Welcome Heading",
      type: "string",
      group: "welcome",
    }),
    defineField({
      name: "welcomeBody",
      title: "Welcome Body",
      type: "array",
      of: [{ type: "block" }],
      group: "welcome",
    }),
    defineField({
      name: "welcomeImage",
      title: "Welcome Image",
      type: "image",
      options: { hotspot: true },
      group: "welcome",
    }),
    defineField({
      name: "welcomeCtaLabel",
      title: "Welcome CTA Label",
      description: 'e.g. "Learn more about us"',
      type: "string",
      group: "welcome",
    }),
    defineField({
      name: "welcomeCtaLink",
      title: "Welcome CTA Link",
      type: "string",
      group: "welcome",
    }),

    // --- Gallery ---
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      description: "Images displayed in the scrolling photo gallery / marquee.",
      type: "array",
      group: "gallery",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),

    // --- Flexible Sections ---
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "sectionType",
              title: "Section Type",
              type: "string",
              options: {
                list: [
                  { title: "Mission", value: "mission" },
                  { title: "Values", value: "values" },
                  { title: "Ministries", value: "ministries" },
                  { title: "Events", value: "events" },
                  { title: "Call to Action", value: "cta" },
                  { title: "Staff", value: "staff" },
                  { title: "Custom", value: "custom" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "cta",
              title: "Call to Action",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                }),
                defineField({
                  name: "link",
                  title: "Link",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              heading: "heading",
              sectionType: "sectionType",
            },
            prepare({ heading, sectionType }) {
              return {
                title: heading || "Untitled Section",
                subtitle: sectionType,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
