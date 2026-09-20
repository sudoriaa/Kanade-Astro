import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(["前端开发", "开发笔记", "生活随笔"]),
    tags: z.array(z.string()),
    cover: z.enum(["astro", "vue", "css", "notes", "life", "typescript", "git", "design"]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };