import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
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
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "timeDisplay",
      title: "Time Display",
      description: 'Human-readable time string, e.g. "6:00 PM - 8:00 PM"',
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      description: 'e.g. "Worship", "Bible Study", "Outreach"',
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
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
      name: "registrationLink",
      title: "Registration Link",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "recurring",
      title: "Recurring Event",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "recurrencePattern",
      title: "Recurrence Pattern",
      description: 'e.g. "Every Wednesday", "First Sunday of the month"',
      type: "string",
      hidden: ({ parent }) => !parent?.recurring,
    }),
  ],
  orderings: [
    {
      title: "Date (Ascending)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "image",
    },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No date",
        media,
      };
    },
  },
});
