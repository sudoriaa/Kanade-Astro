const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Keep internal URLs under the configured deployment path. */
export function withBase(url: string): string {
  if (!url.startsWith("/") || url.startsWith("//")) return url;
  if (base && (url === base || url.startsWith(base + "/"))) return url;
  return base + url;
}
