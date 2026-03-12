import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredSnippet",
      title: "Featured Snippet",
      type: "text",
      rows: 3,
      description: "A short summary shown on blog listing pages and social previews.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dateWritten",
      title: "Date Written",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredOnHome",
      title: "Featured on Home Page",
      type: "boolean",
      initialValue: false,
      description: "Show this post in the featured section on the home page.",
    }),
  ],
  orderings: [
    {
      title: "Date Written, New",
      name: "dateWrittenDesc",
      by: [{ field: "dateWritten", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      date: "dateWritten",
      media: "image",
    },
    prepare({ title, date, media }) {
      const d = date ? new Date(date).toLocaleDateString() : "";
      return {
        title,
        subtitle: d,
        media,
      };
    },
  },
});
