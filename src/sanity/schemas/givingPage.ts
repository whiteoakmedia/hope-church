import { defineType, defineField, defineArrayMember } from "sanity";

export const givingPage = defineType({
  name: "givingPage",
  title: "Giving Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Content" },
    { name: "waysToGive", title: "Ways to Give" },
    { name: "scripture", title: "Scripture" },
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

    // --- Content ---
    defineField({
      name: "mainHeading",
      title: "Main Heading",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "mainBody",
      title: "Main Body",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
    }),
    defineField({
      name: "givingLink",
      title: "Giving Link",
      description: "Overrides the global giving link from Site Settings if set.",
      type: "url",
      group: "content",
    }),
    defineField({
      name: "onlineGivingHeading",
      title: "Online Giving Heading",
      description: 'Heading for the online giving CTA card, e.g. "Give Online".',
      type: "string",
      group: "content",
    }),
    defineField({
      name: "onlineGivingBody",
      title: "Online Giving Body",
      description: "Short description displayed on the online giving CTA card.",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "onlineGivingButtonLabel",
      title: "Online Giving Button Label",
      description: 'e.g. "Give Now"',
      type: "string",
      group: "content",
    }),

    // --- Ways to Give ---
    defineField({
      name: "waysToGive",
      title: "Ways to Give",
      type: "array",
      group: "waysToGive",
      of: [
        defineArrayMember({
          type: "object",
          name: "wayToGive",
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

    // --- Scripture ---
    defineField({
      name: "scriptureText",
      title: "Scripture Text",
      type: "text",
      rows: 4,
      group: "scripture",
    }),
    defineField({
      name: "scriptureReference",
      title: "Scripture Reference",
      description: 'e.g. "2 Corinthians 9:7"',
      type: "string",
      group: "scripture",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Giving Page" };
    },
  },
});
