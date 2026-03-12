import { defineField, defineType } from "sanity";

export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
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
      name: "speaker",
      title: "Speaker",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeVideoId",
      title: "YouTube Video ID",
      type: "string",
      description: "The video ID portion of the YouTube URL (e.g. dQw4w9WgXcQ)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "datePreached",
      title: "Date Preached",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Date Preached, New",
      name: "datePreachedDesc",
      by: [{ field: "datePreached", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "speaker",
      date: "datePreached",
    },
    prepare({ title, subtitle, date }) {
      const d = date ? new Date(date).toLocaleDateString() : "";
      return {
        title,
        subtitle: `${subtitle} — ${d}`,
      };
    },
  },
});
