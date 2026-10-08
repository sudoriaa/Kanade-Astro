<script setup lang="ts">
import { t } from "../../i18n";
defineProps<{ kind: string; featured?: boolean }>();
const labels: Record<string, { icon: string; title: string; sub: string }> = {
  astro: {
    icon: "icon-[simple-icons--astro]",
    title: "Astro",
    sub: t("cover.astroSubtitle"),
  },
  vue: {
    icon: "icon-[simple-icons--vuedotjs]",
    title: "Vue.js",
    sub: t("cover.vueSubtitle"),
  },
  css: {
    icon: "icon-[lucide--palette]",
    title: t("cover.cssTitle"),
    sub: t("cover.cssSubtitle"),
  },
  notes: {
    icon: "icon-[lucide--coffee]",
    title: t("cover.notesTitle"),
    sub: t("cover.notesSubtitle"),
  },
  life: {
    icon: "icon-[lucide--sprout]",
    title: t("cover.lifeTitle"),
    sub: t("cover.lifeSubtitle"),
  },
  typescript: {
    icon: "icon-[simple-icons--typescript]",
    title: "TypeScript",
    sub: t("cover.typescriptSubtitle"),
  },
  git: {
    icon: "icon-[simple-icons--git]",
    title: t("cover.gitTitle"),
    sub: t("cover.gitSubtitle"),
  },
  design: {
    icon: "icon-[lucide--sparkles]",
    title: t("cover.designTitle"),
    sub: t("cover.designSubtitle"),
  },
};
</script>
<template>
  <div class="post-cover" :class="[kind, { featured }]" aria-hidden="true">
    <div class="cover-grid"></div>
    <span class="cover-orbit"></span><span class="cover-dot"></span>
    <span class="cover-corner">{{ t("cover.journal") }}</span>
    <span class="cover-icon" :class="labels[kind]?.icon"></span>
    <strong>{{
      featured ? t("cover.featuredTitle") : labels[kind]?.title
    }}</strong>
    <small>{{
      featured ? t("cover.featuredSubtitle") : labels[kind]?.sub
    }}</small>
    <span class="cover-star">✧</span>
  </div>
</template>
<style scoped>
.post-cover {
  min-height: 180px;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #79539c;
  background: #eee6f7;
  padding: 28px 12px;
  isolation: isolate;
}
.cover-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(#ffffff42 1px, transparent 1px),
    linear-gradient(90deg, #ffffff42 1px, transparent 1px);
  background-size: 23px 23px;
  z-index: -1;
  mask-image: linear-gradient(30deg, black, transparent 80%);
}
.cover-orbit {
  position: absolute;
  height: 190px;
  width: 190px;
  border: 1px solid #ffffff70;
  border-radius: 50%;
  right: -75px;
  top: -80px;
  box-shadow:
    0 0 0 20px #ffffff15,
    0 0 0 40px #ffffff15;
  z-index: -1;
}
.cover-dot {
  position: absolute;
  bottom: -35px;
  left: -40px;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  background: #ffffff25;
}
.cover-corner {
  position: absolute;
  top: 13px;
  left: 15px;
  font:
    7px "Oxanium-Medium",
    var(--font-body);
  letter-spacing: 0.14em;
  opacity: 0.6;
}
.cover-icon {
  display: block;
  font-size: 43px;
  margin: 4px 0 7px;
  opacity: 0.86;
}
strong {
  font:
    600 25px "Oxanium-Medium",
    var(--font-body);
  letter-spacing: -0.6px;
  white-space: nowrap;
}
small {
  font:
    6px "Oxanium-Medium",
    var(--font-body);
  letter-spacing: 0.12em;
  margin-top: 9px;
  opacity: 0.75;
  white-space: nowrap;
}
.cover-star {
  position: absolute;
  font-size: 30px;
  bottom: 16px;
  right: 18px;
  opacity: 0.5;
}
.css {
  background: #fbe4e5;
  color: #b76f85;
}
.vue,
.life {
  background: #e2efe7;
  color: #588f7a;
}
.notes {
  background: #f1e5d9;
  color: #a88969;
}
.typescript {
  background: #dfebf7;
  color: #648db2;
}
.git {
  background: #fae7df;
  color: #bc7e68;
}
.design {
  background: #e5e6fa;
  color: #8283b5;
}
.featured {
  background: #e9e1f4;
}
:global(.dark .post-cover) {
  filter: brightness(0.75) saturate(0.8);
}
</style>
