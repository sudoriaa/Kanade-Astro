import type { APIRoute } from "astro";
import { getPosts } from "../lib/posts";
import { siteInfo } from "../config";
export const GET: APIRoute = async () => {
  const paths = ["/", "/posts/", "/friends/", "/about/", "/messages/", ...(await getPosts()).map(post => `/posts/${post.id}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, siteInfo.url).href.replaceAll("&", "&amp;")}</loc></url>`).join("")}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};