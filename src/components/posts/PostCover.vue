<script setup lang="ts">
defineProps<{ kind: string; featured?: boolean }>();
const labels: Record<string, { icon: string; title: string; sub: string }> = {
  astro: { icon: "icon-[simple-icons--astro]", title: "Astro", sub: "BUILD SOMETHING YOU LOVE" },
  vue: { icon: "icon-[simple-icons--vuedotjs]", title: "Vue.js", sub: "LESS CODE, MORE POSSIBILITIES" },
  css: { icon: "icon-[lucide--palette]", title: "Little details.", sub: "MAKE THE WEB A LITTLE SOFTER" },
  notes: { icon: "icon-[lucide--coffee]", title: "Slow moments", sub: "A LITTLE SPACE FOR YOURSELF" },
  life: { icon: "icon-[lucide--sprout]", title: "Dear, life.", sub: "COLLECT THE LITTLE THINGS" },
  typescript: { icon: "icon-[simple-icons--typescript]", title: "TypeScript", sub: "MAKE THE BOUNDARIES CLEAR" },
  git: { icon: "icon-[simple-icons--git]", title: "One step.", sub: "SMALL COMMITS, BETTER STORIES" },
  design: { icon: "icon-[lucide--sparkles]", title: "Just create.", sub: "TURN AN IDEA INTO SOMETHING" },
};
</script>
<template>
  <div class="post-cover" :class="[kind, { featured }]" aria-hidden="true">
    <div class="cover-grid"></div><span class="cover-orbit"></span><span class="cover-dot"></span>
    <span class="cover-corner">K / JOURNAL</span>
    <span class="cover-icon" :class="labels[kind]?.icon"></span>
    <strong>{{ featured ? "Hello, Kanade." : labels[kind]?.title }}</strong>
    <small>{{ featured ? "A NEW STORY BEGINS HERE" : labels[kind]?.sub }}</small>
    <span class="cover-star">✧</span>
  </div>
</template>
<style scoped>
.post-cover { min-height: 180px; height: 100%; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #79539c; background: #eee6f7; padding: 28px 12px; isolation: isolate; }
.cover-grid { position: absolute; inset: 0; background-image: linear-gradient(#ffffff42 1px, transparent 1px), linear-gradient(90deg, #ffffff42 1px, transparent 1px); background-size: 23px 23px; z-index: -1; mask-image: linear-gradient(30deg, black, transparent 80%); }
.cover-orbit { position: absolute; height: 190px; width: 190px; border: 1px solid #ffffff70; border-radius: 50%; right: -75px; top: -80px; box-shadow: 0 0 0 20px #ffffff15, 0 0 0 40px #ffffff15; z-index: -1; }
.cover-dot { position: absolute; bottom: -35px; left: -40px; border-radius: 50%; width: 120px; height: 120px; background: #ffffff25; }
.cover-corner { position: absolute; top: 13px; left: 15px; font: 7px "Oxanium-Medium", sans-serif; letter-spacing: .14em; opacity: .6; }
.cover-icon { display: block; font-size: 43px; margin: 4px 0 7px; opacity: .86; }
strong { font: 600 25px "Oxanium-Medium", sans-serif; letter-spacing: -.6px; white-space: nowrap; }
small { font: 6px "Oxanium-Medium", sans-serif; letter-spacing: .12em; margin-top: 9px; opacity: .75; white-space: nowrap; }
.cover-star { position: absolute; font-size: 30px; bottom: 16px; right: 18px; opacity: .5; }
.css { background: #fbe4e5; color: #b76f85; }
.vue, .life { background: #e2efe7; color: #588f7a; }
.notes { background: #f1e5d9; color: #a88969; }
.typescript { background: #dfebf7; color: #648db2; }
.git { background: #fae7df; color: #bc7e68; }
.design { background: #e5e6fa; color: #8283b5; }
.featured { background: #e9e1f4; }
.dark .post-cover { filter: brightness(.75) saturate(.8); }
</style>