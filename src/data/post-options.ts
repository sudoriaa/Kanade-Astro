import { t } from "../i18n";
export const categoryNames = ["frontend", "notes", "life"] as const;
export type Category = (typeof categoryNames)[number];
export const categoryLabel = (category: string) =>
  categoryNames.includes(category as Category)
    ? t(`category.${category as Category}`)
    : category;
// Preserve links and frontmatter written before language-independent IDs.
export function normalizeCategory(value: string): string {
  const legacy: Record<string, Category> = {
    前端开发: "frontend",
    开发笔记: "notes",
    生活随笔: "life",
  };
  return (
    legacy[value] ??
    categoryNames.find((category) => categoryLabel(category) === value) ??
    value
  );
}
export const coverNames = [
  "astro",
  "vue",
  "css",
  "notes",
  "life",
  "typescript",
  "git",
  "design",
] as const;
