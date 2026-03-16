import { defineType, defineField } from "sanity";

export const staffPage = defineType({
  name: "staffPage",
  title: "Staff Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "cta", title: "Bottom CTA" },
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

    // --- Bottom CTA ---
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaBody",
      title: "CTA Body",
      type: "text",
      rows: 3,
      group: "cta",
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "CTA Button Label",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaButtonLink",
      title: "CTA Button Link",
      type: "string",
      group: "cta",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Staff Page" };
    },
  },
});
