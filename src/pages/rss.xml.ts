import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts";
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
      link: `/posts/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: `<language>${siteInfo.language}</language>`,
  });
