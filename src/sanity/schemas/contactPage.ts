import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "form", title: "Form Settings" },
    { name: "quote", title: "Staff Quote" },
    { name: "content", title: "Additional Content" },
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

    // --- Form ---
    defineField({
      name: "formHeading",
      title: "Form Heading",
      description: 'e.g. "Get Connected"',
      type: "string",
      group: "form",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Subtitle",
      type: "string",
      group: "form",
    }),
    defineField({
      name: "recipientEmail",
      title: "Form Recipient Email",
      type: "string",
      group: "form",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "successMessage",
      title: "Form Success Message",
      type: "string",
      group: "form",
    }),

    // --- Staff Quote ---
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      rows: 3,
      group: "quote",
    }),
    defineField({
      name: "quoteAttribution",
      title: "Attribution Name",
      type: "string",
      group: "quote",
    }),
    defineField({
      name: "quoteRole",
      title: "Attribution Role",
      type: "string",
      group: "quote",
    }),

    // --- Map & Content ---
    defineField({
      name: "showMap",
      title: "Show Map",
      type: "boolean",
      initialValue: true,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Additional Content",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
