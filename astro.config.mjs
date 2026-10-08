// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

const { SITE_URL = "http://localhost:4321" } = loadEnv(
  process.env.NODE_ENV ?? "production",
  process.cwd(),
  "SITE_URL",
);
const site = new URL(SITE_URL);
if (
  !["http:", "https:"].includes(site.protocol) ||
  site.pathname !== "/" ||
  site.search ||
  site.hash ||
  site.username ||
  site.password
) {
  throw new Error(
    "SITE_URL 必须是 HTTP(S) 域名根地址，例如 https://example.com。",
  );
}

// https://astro.build/config
export default defineConfig({
  site: site.href,
  output: "static",
  trailingSlash: "always",
  // Preserve the spacing between inline elements when migrating from Astro 5.
  compressHTML: true,
  integrations: [
    vue(),
    sitemap({
      filter: (page) =>
        !["/404/", "/404.html", "/articles/", "/comments/"].includes(
          new URL(page).pathname,
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
