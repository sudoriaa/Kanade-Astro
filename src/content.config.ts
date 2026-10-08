import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { categoryNames, coverNames } from "./data/post-options";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.coerce.date(),
    category: z.enum(categoryNames),
    tags: z.array(z.string().trim().min(1)),
    cover: z.enum(coverNames),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
