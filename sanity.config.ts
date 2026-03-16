import { defineConfig, type SchemaTypeDefinition } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes as templateSchemas } from "@whiteoakmedia/sanity-schemas";
import { blogPost } from "./src/sanity/schemas/blogPost";
import { blockContent } from "./src/sanity/schemas/blockContent";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bb1he81m";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "hope-church",
  title: "Hope Christian Church",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      ...(templateSchemas as unknown as SchemaTypeDefinition[]),
      blogPost,
      blockContent,
    ],
  },
  basePath: "/studio",
});
