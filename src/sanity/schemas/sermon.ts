import { defineType, defineField } from "sanity";

export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "preacher",
      title: "Preacher",
      type: "reference",
      to: [{ type: "staff" }],
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "series",
      title: "Series Name",
      type: "string",
    }),
    defineField({
      name: "scriptureReference",
      title: "Scripture Reference",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "YouTube or Vimeo embed URL",
      type: "url",
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
    }),
    defineField({
      name: "audioUrl",
      title: "Audio URL",
      description: "External audio URL (if not uploading a file).",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      series: "series",
      media: "image",
    },
    prepare({ title, date, series, media }) {
      return {
        title,
        subtitle: [series, date].filter(Boolean).join(" — "),
        media,
      };
    },
  },
});
