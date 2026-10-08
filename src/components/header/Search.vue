<script setup lang="ts">
import { t, formatDate } from "../../i18n";
import { categoryLabel } from "../../data/post-options";
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import type { PostSummary } from "../../lib/posts";
const props = defineProps<{ posts: PostSummary[] }>();
const dialog = ref<HTMLDialogElement>();
const input = ref<HTMLInputElement>();
const query = ref("");
const results = computed(() => {
  const terms = query.value
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return props.posts.slice(0, 4);
  return props.posts.filter((p) =>
    terms.every((term) =>
      [p.title, p.description, p.category, categoryLabel(p.category), ...p.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
    ),
  );
});
let opener: HTMLElement | null = null;
const open = async () => {
  if (dialog.value?.open) return;
  opener = document.activeElement as HTMLElement | null;
  query.value = "";
  dialog.value?.showModal();
  document.body.style.overflow = "hidden";
  await nextTick();
  input.value?.focus();
};
const close = () => {
  dialog.value?.close();
};
const afterClose = () => {
  document.body.style.overflow = "";
  opener?.focus();
};
const keydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && dialog.value?.open) {
    e.preventDefault();
    close();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open();
  }
};
onMounted(() => {
  window.addEventListener("kanade:search", open);
  window.addEventListener("keydown", keydown, true);
});
onUnmounted(() => {
  window.removeEventListener("kanade:search", open);
  window.removeEventListener("keydown", keydown, true);
  document.body.style.overflow = "";
});
</script>
<template>
  <dialog
    ref="dialog"
    class="search-dialog"
    aria-labelledby="search-title"
    @close="afterClose"
    @click="
      (e) => {
        if (e.target === dialog) close();
      }
    "
  >
    <div class="search-body">
      <div class="search-heading">
        <h2 id="search-title">{{ t("search.title") }}</h2>
        <button :aria-label="t('search.close')" @click="close">
          <span class="icon-[lucide--x]"></span>
        </button>
      </div>
      <div class="search-field">
        <span class="icon-[lucide--search]"></span
        ><input
          ref="input"
          v-model="query"
          type="search"
          :placeholder="t('search.placeholder')"
          :aria-label="t('search.keywords')"
        /><kbd>ESC</kbd>
      </div>
      <p class="search-meta" aria-live="polite">
        {{
          query.trim()
            ? t("search.results", { count: results.length })
            : t("search.recent")
        }}
      </p>
      <div class="search-results">
        <a
          v-for="post in results"
          :key="post.id"
          :href="`/posts/${post.id}/`"
          class="search-result"
          ><span class="result-icon icon-[lucide--file-text]"></span>
          <div>
            <strong>{{ post.title }}</strong>
            <p>
              {{ categoryLabel(post.category) }} · {{ formatDate(post.date) }}
            </p>
          </div>
          <span class="icon-[lucide--arrow-up-right]"></span
        ></a>
        <div v-if="!results.length" class="empty-state">
          <span class="icon-[lucide--search-x]"></span>
          <h3>{{ t("search.emptyTitle") }}</h3>
          <p>{{ t("search.emptyHint") }}</p>
        </div>
      </div>
      <div class="search-footer">
        {{ t("search.footer") }}<span>{{ t("search.shortcuts") }}</span>
      </div>
    </div>
  </dialog>
</template>
<style scoped>
.search-dialog {
  position: fixed;
  margin: 14vh auto auto;
  padding: 0;
  width: min(620px, calc(100% - 28px));
  max-height: 76vh;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--card);
  color: var(--text);
  box-shadow: 0 20px 100px #35233133;
  overflow: auto;
}
.search-dialog::backdrop {
  background: #1c172a65;
  backdrop-filter: blur(6px);
}
.search-body {
  padding: 24px;
}
.search-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.search-heading h2 {
  font-size: 17px;
  margin: 0;
}
.search-heading button {
  display: grid;
  place-items: center;
  background: var(--accent-soft);
  border: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--accent);
}
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
  border-radius: 10px;
  padding: 12px;
  color: var(--accent);
}
.search-field input {
  border: 0;
  outline: none;
  min-width: 0;
  flex: 1;
  background: transparent;
  color: var(--text);
  font-size: 14px;
}
.search-field:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
kbd {
  color: var(--muted);
  font: 10px var(--font-body);
  padding: 2px 4px;
  border: 1px solid var(--line);
  border-radius: 4px;
}
.search-meta {
  font-size: 12px;
  color: var(--muted);
  margin: 19px 0 8px;
}
.search-result {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 10px;
  border-radius: 10px;
}
.search-result:hover {
  background: var(--accent-soft);
}
.search-result div {
  flex: 1;
  min-width: 0;
}
.search-result strong {
  font-size: 14px;
  font-weight: 400;
}
.search-result p {
  font-size: 11px;
  color: var(--muted);
  margin: 4px 0 0;
}
.result-icon {
  color: var(--accent);
  font-size: 22px;
  flex-shrink: 0;
}
.search-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding-top: 15px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
}
</style>
