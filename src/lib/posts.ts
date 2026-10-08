import { getCollection, type CollectionEntry } from "astro:content";
import { categoryNames } from "../data/post-options";

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
  return (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
export function summarize(post: CollectionEntry<"posts">): PostSummary {
  return {
    id: post.id,
    ...post.data,
    date: post.data.date.toISOString().slice(0, 10),
    minutes: Math.max(1, Math.ceil((post.body?.length || 0) / 400)),
  };
}
export function getTags(posts: PostSummary[]) {
  return [...new Set(posts.flatMap((post) => post.tags))];
}
