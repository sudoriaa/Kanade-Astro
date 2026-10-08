import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts, getPostId } from "../lib/posts";
import { categoryLabel } from "../data/post-options";
import { siteInfo } from "../config";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: siteInfo.title,
    description: siteInfo.description,
    site: site!,
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${getPostId(post)}/`,
      categories: [categoryLabel(post.data.category)],
    })),
    customData: `<language>${siteInfo.language}</language>`,
  });
