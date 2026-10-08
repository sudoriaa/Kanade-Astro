import { getCollection, type CollectionEntry } from "astro:content";
import { categoryNames } from "../data/post-options";
import { language } from "../i18n";

export type PostSummary = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  featured: boolean;
  minutes: number;
};
export const categories = categoryNames;

export async function getPosts() {
  return (
    await getCollection(
      "posts",
      ({ data }) => !data.draft && data.lang === language,
    )
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export function summarize(post: CollectionEntry<"posts">): PostSummary {
  return {
    id: getPostId(post),
    ...post.data,
    date: post.data.date.toISOString().slice(0, 10),
    minutes: readingMinutes(post.body ?? "", post.data.lang),
  };
}
function readingMinutes(body: string, lang: string): number {
  const length =
    lang === "en"
      ? body.trim().split(/\s+/).filter(Boolean).length
      : body.length;
  const rate = lang === "en" ? 200 : lang === "ja" ? 500 : 400;
  return Math.max(1, Math.ceil(length / rate));
}
export function getPostId(post: CollectionEntry<"posts">): string {
  const prefix = `${post.data.lang.toLowerCase()}/`;
  return post.id.startsWith(prefix) ? post.id.slice(prefix.length) : post.id;
}
export function getTags(posts: PostSummary[]) {
  return [...new Set(posts.flatMap((post) => post.tags))];
}
