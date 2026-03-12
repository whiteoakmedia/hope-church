import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "churchName",
      title: "Church Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "sundayTime",
      title: "Sunday Service Time",
      type: "string",
      description: 'e.g. "10:00 AM"',
    }),
    defineField({
      name: "wednesdayTime",
      title: "Wednesday Service Time",
      type: "string",
      description: 'e.g. "7:00 PM"',
    }),
    defineField({
      name: "welcomeVideoId",
      title: "Welcome Video (YouTube ID)",
      type: "string",
      description: "YouTube video ID for the welcome/intro video.",
    }),
    defineField({
      name: "giveUrl",
      title: "Give / Donate URL",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook Page URL",
      type: "url",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube Channel URL",
      type: "url",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Background image for the homepage hero section.",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      description: "Main heading in the hero section.",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      description: "Subtext displayed below the hero heading.",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      description: "Heading for the call-to-action section on the homepage.",
    }),
    defineField({
      name: "ctaSubtext",
      title: "CTA Subtext",
      type: "text",
      rows: 2,
      description: "Subtext for the call-to-action section.",
    }),
  ],
  preview: {
    select: { title: "churchName" },
  },
});
