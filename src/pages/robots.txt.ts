import type { APIRoute } from "astro";
import { siteInfo } from "../config";
export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", siteInfo.url).href}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });