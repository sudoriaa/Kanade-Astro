import { withBase } from "../lib/urls";
import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts";
import { siteInfo } from "../config";
const escape = (value: string) => value.replace(/[<>&"']/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${escape(siteInfo.title)}</title><description>${escape(siteInfo.description)}</description><link>${escape(siteInfo.url)}</link><language>zh-CN</language>
${posts.map(post => { const url = new URL(withBase(`/posts/${post.id}/`), siteInfo.url).href; return `<item><title>${escape(post.data.title)}</title><link>${escape(url)}</link><guid>${escape(url)}</guid><description>${escape(post.data.description)}</description><pubDate>${post.data.date.toUTCString()}</pubDate><category>${escape(post.data.category)}</category></item>`; }).join("\n")}
</channel></rss>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};