import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event Name",
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
      name: "image",
      title: "Event Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Start Date / Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "End Date / Time",
      type: "datetime",
    }),
    defineField({
      name: "registerLink",
      title: "Registration Link",
      type: "url",
      description: "External link for event registration.",
    }),
    defineField({
      name: "promoVideo",
      title: "Promo Video URL",
      type: "url",
      description: "YouTube or other video link to promote the event.",
    }),
    defineField({
      name: "isKids",
      title: "Kids Event",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isYouth",
      title: "Youth Event",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      initialValue: false,
      description: "Mark as archived to remove from the upcoming events list.",
    }),
  ],
  orderings: [
    {
      title: "Start Time, New",
      name: "startTimeDesc",
      by: [{ field: "startTime", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      date: "startTime",
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
