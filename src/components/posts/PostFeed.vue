<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { PostSummary } from "../../lib/posts";
import PostCover from "./PostCover.vue";
const props = defineProps<{ posts: PostSummary[]; archive?: boolean }>();
const category = ref("");
const tag = ref("");
const month = ref("");
const query = ref("");
const page = ref(1);
const ready = ref(false);
const feed = ref<HTMLElement>();
const pageSize = 5;
const categoryNames = ["前端开发", "开发笔记", "生活随笔"];
const filtered = computed(() => props.posts.filter(p =>
  (!category.value || p.category === category.value) &&
  (!tag.value || p.tags.includes(tag.value)) &&
  (!month.value || p.date.startsWith(month.value)) &&
  (!query.value.trim() || [p.title, p.description, ...p.tags].join(" ").toLowerCase().includes(query.value.trim().toLowerCase()))
));
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));
const displayed = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize));
function syncUrl() {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries({ category: category.value, tag: tag.value, month: month.value, q: query.value.trim(), page: page.value > 1 ? String(page.value) : "" })) {
    value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", url);
}
function readUrl() {
  const params = new URLSearchParams(window.location.search);
  category.value = params.get("category") || "";
  tag.value = params.get("tag") || "";
  month.value = params.get("month") || "";
  query.value = params.get("q") || "";
  const value = Number(params.get("page"));
  page.value = Number.isInteger(value) && value > 0 ? Math.min(value, totalPages.value) : 1;
}
function setCategory(value: string) { category.value = value; tag.value = ""; month.value = ""; page.value = 1; syncUrl(); }
function reset() { category.value = ""; tag.value = ""; month.value = ""; query.value = ""; page.value = 1; syncUrl(); }
function search() { page.value = 1; syncUrl(); }
function turnPage(value: number) {
  page.value = value; syncUrl();
  feed.value?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}
onMounted(() => { readUrl(); ready.value = true; window.addEventListener("popstate", readUrl); });
onUnmounted(() => window.removeEventListener("popstate", readUrl));
</script>
<template>
  <section ref="feed" class="post-feed" :data-ready="ready">
    <div v-if="archive" class="card archive-intro"><span class="eyebrow">THE ARCHIVE</span><h2>文字里的时光</h2><p>共 {{ posts.length }} 篇记录，每一篇都是成长的脚印。</p><label class="archive-search"><span class="icon-[lucide--search]"></span><input v-model="query" @input="search" type="search" aria-label="筛选文章" placeholder="在文章里找一找…" /></label></div>
    <div v-else class="feed-title"><h2><span class="icon-[lucide--notebook-pen]"></span>最新文章<small>LATEST POSTS</small></h2><span class="feed-count">{{ posts.length }} 篇记录</span></div>
    <div class="feed-tabs card" aria-label="文章分类">
      <button :class="{ selected: !category && !tag && !month }" :aria-pressed="!category && !tag && !month" @click="reset">全部文章 <span>{{ posts.length }}</span></button>
      <button v-for="name in categoryNames" :key="name" :class="{ selected: category === name }" :aria-pressed="category === name" @click="setCategory(name)">{{ name }}</button>
    </div>
    <div v-if="tag || month || (category && !categoryNames.includes(category))" class="filter-summary"><span>正在浏览：{{ tag || month || category }}</span><button @click="reset">清除筛选 ×</button></div>
    <div class="post-list" aria-live="polite">
      <article v-for="post in displayed" :key="post.id" class="post-card card" :data-category="post.category">
        <a :href="`/posts/${post.id}/`" class="cover-link" :aria-label="`阅读：${post.title}`" tabindex="-1"><PostCover :kind="post.cover" :featured="post.featured" /></a>
        <div class="post-info">
          <div class="post-kicker"><span v-if="post.featured" class="pin"><span class="icon-[lucide--pin]"></span>置顶</span><a :href="`/posts/?category=${encodeURIComponent(post.category)}`">{{ post.category }}</a><span class="meta-divider">/</span><time :datetime="post.date">{{ post.date.replaceAll("-", ".") }}</time></div>
          <h3><a :href="`/posts/${post.id}/`">{{ post.title }}</a></h3>
          <p class="post-description">{{ post.description }}</p>
          <div class="post-bottom"><div class="post-tags"><a v-for="item in post.tags.slice(0, 2)" :key="item" :href="`/posts/?tag=${encodeURIComponent(item)}`"># {{ item }}</a></div><a class="read-post" :href="`/posts/${post.id}/`" :aria-label="`阅读全文：${post.title}`">{{ post.minutes }} 分钟<span class="icon-[lucide--arrow-up-right]"></span></a></div>
        </div>
      </article>
      <div v-if="!displayed.length" class="empty-state card"><span class="icon-[lucide--notebook]"></span><h3>这一页，还等着新的故事</h3><p>没有匹配的文章，换个关键词试试吧。</p><button class="btn secondary" @click="reset">查看全部文章</button></div>
    </div>
    <nav v-if="totalPages > 1" class="pagination" aria-label="文章分页">
      <button @click="turnPage(page - 1)" :disabled="page === 1" aria-label="上一页"><span class="icon-[lucide--chevron-left]"></span></button>
      <button v-for="index in totalPages" :key="index" @click="turnPage(index)" :class="{ current: page === index }" :aria-current="page === index ? 'page' : undefined" :aria-label="`第 ${index} 页`">{{ index }}</button>
      <button @click="turnPage(page + 1)" :disabled="page === totalPages" aria-label="下一页"><span class="icon-[lucide--chevron-right]"></span></button>
      <span>共 {{ filtered.length }} 篇</span>
    </nav>
    <div class="feed-end"><span></span>把每一份热爱，都好好收藏。<span></span></div>
  </section>
</template>
<style scoped>
.post-feed { scroll-margin-top: 92px; }
.feed-title { display: flex; justify-content: space-between; align-items: center; margin: 0 1px 16px; height: 26px; }
.feed-title h2 { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; margin: 0; }
.feed-title h2 > span { color: var(--accent); }
.feed-title small { font: 9px "Oxanium-Medium", sans-serif; letter-spacing: .12em; margin-left: 5px; color: var(--muted); }
.feed-count { font-size: 11px; color: var(--muted); }
.feed-tabs { display: flex; gap: 6px; align-items: center; padding: 9px 10px; margin-bottom: 18px; border-radius: 13px; }
.feed-tabs button { padding: 7px 13px; color: var(--muted); font-size: 12px; background: transparent; border: 0; border-radius: 8px; white-space: nowrap; }
.feed-tabs button.selected { color: #fff; background: var(--accent); }
.feed-tabs button:not(.selected):hover { color: var(--accent); background: var(--accent-soft); }
.feed-tabs button > span { display: inline-block; margin-left: 5px; font: 10px "Oxanium-Medium"; padding: 0 4px; border-radius: 3px; background: #ffffff25; }
.post-list { display: flex; flex-direction: column; gap: 18px; }
.post-card { display: grid; grid-template-columns: 32% minmax(0, 1fr); overflow: hidden; min-height: 205px; transition: transform .25s, box-shadow .25s; }
.post-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px #98566a10; }
.cover-link { display: block; overflow: hidden; margin: 9px 0 9px 9px; border-radius: 11px; }
.cover-link :deep(.post-cover) { transition: transform .5s; }
.post-card:hover .cover-link :deep(.post-cover) { transform: scale(1.035); }
.post-info { padding: 19px 20px 17px; display: flex; flex-direction: column; min-width: 0; }
.post-kicker { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; font-size: 10px; color: var(--muted); }
.post-kicker a { color: var(--accent); }
.pin { display: inline-flex; align-items: center; gap: 3px; padding: 1px 5px; background: var(--accent-soft); color: var(--accent); border-radius: 4px; }
.meta-divider { color: var(--line); }
.post-info h3 { font-size: 17px; line-height: 1.65; font-weight: 600; margin: 8px 0 7px; }
.post-info h3 a:hover { color: var(--accent); }
.post-description { color: var(--muted); font-size: 12px; line-height: 1.85; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: 8px; font-size: 10px; }
.post-tags { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); }
.post-tags a:hover { color: var(--accent); }
.read-post { display: flex; align-items: center; gap: 9px; flex-shrink: 0; color: var(--muted); }
.read-post > span { color: var(--accent); background: var(--accent-soft); border-radius: 50%; font-size: 18px; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 27px 0 22px; }
.pagination button { border: 1px solid var(--line); border-radius: 9px; width: 34px; height: 34px; display: grid; place-items: center; background: var(--card); color: var(--muted); font-family: "Oxanium-Medium", sans-serif; font-size: 12px; }
.pagination button.current { background: var(--accent); border-color: var(--accent); color: white; }
.pagination > span { font-size: 11px; color: var(--muted); margin-left: 8px; }
.feed-end { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 11px; color: var(--muted); margin-top: 24px; }
.feed-end > span { width: 28px; height: 1px; background: #e6c8d2; }
.archive-intro { padding: 25px; margin-bottom: 18px; }
.archive-intro h2 { font-size: 25px; margin: 6px 0; }
.archive-intro p { font-size: 13px; color: var(--muted); margin: 0 0 18px; }
.archive-search { display: flex; align-items: center; gap: 10px; color: var(--accent); padding: 9px 13px; background: var(--bg); border: 1px solid var(--line); border-radius: 9px; }
.archive-search:focus-within { outline: 2px solid var(--accent); }
.archive-search input { min-width: 0; flex: 1; border: 0; outline: 0; background: none; color: var(--text); font-size: 13px; }
.filter-summary { display:flex; justify-content: space-between; color: var(--accent); font-size: 12px; margin: 0 5px 14px; }
.filter-summary button { border: 0; background: none; color: var(--muted); }
@media (max-width: 760px) {
  .feed-title small { display: none; }
  .feed-tabs { justify-content: space-between; gap: 1px; padding: 8px; }
  .feed-tabs button { padding: 7px 9px; font-size: 11px; }
  .post-card { grid-template-columns: 29% minmax(0, 1fr); min-height: 185px; }
  .post-info { padding: 14px 13px; }
  .post-info h3 { font-size: 15px; margin: 6px 0; }
  .post-description { font-size: 11px; margin-bottom: 10px; }
  .post-kicker { font-size: 9px; gap: 5px; }
  .cover-link :deep(strong) { font-size: 13px; }
  .cover-link :deep(small), .cover-link :deep(.cover-corner) { display: none; }
  .cover-link :deep(.cover-icon) { font-size: 33px; }
  .cover-link :deep(.cover-star) { font-size: 18px; right: 9px; }
  .post-tags { gap: 6px; }
  .read-post { gap: 5px; }
}
@media (max-width: 370px) { .post-card { grid-template-columns: 1fr; } .cover-link { margin: 8px 8px 0; } .cover-link :deep(.post-cover) { min-height: 135px; } }
</style>
