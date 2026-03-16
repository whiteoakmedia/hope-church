import { defineType, defineField, defineArrayMember } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "whoWeAre", title: "Who We Are" },
    { name: "beliefs", title: "What We Believe" },
    { name: "denomination", title: "Denomination" },
    { name: "staff", title: "Staff" },
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

    // --- Who We Are ---
    defineField({
      name: "whoWeAreHeading",
      title: "Heading",
      type: "string",
      group: "whoWeAre",
    }),
    defineField({
      name: "whoWeAreBody",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      group: "whoWeAre",
    }),
    defineField({
      name: "whoWeAreImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "whoWeAre",
    }),

    // --- What We Believe ---
    defineField({
      name: "beliefsHeading",
      title: "Heading",
      type: "string",
      group: "beliefs",
    }),
    defineField({
      name: "beliefs",
      title: "Beliefs",
      type: "array",
      group: "beliefs",
      of: [
        defineArrayMember({
          type: "object",
          name: "belief",
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
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
    }),

    // --- Denomination ---
    defineField({
      name: "denominationHeading",
      title: "Heading",
      type: "string",
      group: "denomination",
    }),
    defineField({
      name: "denominationBody",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      group: "denomination",
    }),
    defineField({
      name: "denominationImage",
      title: "Logo / Image",
      type: "image",
      options: { hotspot: true },
      group: "denomination",
    }),

    // --- Staff ---
    defineField({
      name: "showStaff",
      title: "Show Staff Section",
      description: "Staff members are pulled from the Staff collection.",
      type: "boolean",
      initialValue: true,
      group: "staff",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
