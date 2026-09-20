<script setup lang="ts">
import { ref, onMounted } from "vue";
type Message = { id: string; name: string; content: string; date: string };
const storageKey = "kanade:guestbook:v1";
const name = ref("");
const content = ref("");
const messages = ref<Message[]>([]);
const feedback = ref("");
const error = ref("");
const ready = ref(false);
const isMessage = (value: unknown): value is Message => {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Partial<Message>;
  return typeof message.id === "string" && typeof message.name === "string" && message.name.length <= 24 &&
    typeof message.content === "string" && message.content.length <= 500 && typeof message.date === "string" && Number.isFinite(Date.parse(message.date));
};
onMounted(() => {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
    messages.value = Array.isArray(raw) ? raw.filter(isMessage).slice(0, 100) : [];
  } catch { error.value = "浏览器存储暂不可用。你仍可以编辑文字，请复制留存。"; }
  ready.value = true;
});
function save(next: Message[]) {
  try { localStorage.setItem(storageKey, JSON.stringify(next)); messages.value = next; return true; }
  catch { error.value = "留言未保存：浏览器存储已满或已被关闭，请复制文字留存后重试。"; return false; }
}
function submit() {
  error.value = ""; feedback.value = "";
  const author = name.value.trim(); const text = content.value.trim();
  if (!author || !text) { error.value = "请填写昵称和想说的话。"; return; }
  if (author.length > 24 || text.length > 500) { error.value = "昵称最多 24 字，留言最多 500 字。"; return; }
  if (messages.value.length >= 100) { error.value = "本地已保存 100 条留言，删除一些旧留言后再试试。"; return; }
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  if (save([{ id, name: author, content: text, date: new Date().toISOString() }, ...messages.value])) {
    content.value = ""; feedback.value = "已保存在当前浏览器，刷新页面后仍可查看。";
  }
}
function remove(id: string) {
  error.value = "";
  if (save(messages.value.filter(message => message.id !== id))) feedback.value = "这条本地留言已删除。";
}
function emoji(value: string) { if (content.value.length + value.length <= 500) content.value += value; }
function dateLabel(date: string) { return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)); }
</script>
<template>
  <div class="guestbook" :data-ready="ready">
    <section class="card page-card">
      <div class="page-heading"><span class="eyebrow">LEAVE A LITTLE KINDNESS</span><h2>见字如面</h2><p>一句问候，一点想法，或者分享你今天的小确幸。</p></div>
      <div class="local-notice"><span class="icon-[lucide--info]"></span><p>本地留言本 · 内容仅保存在当前浏览器，仅你可见，不会发送给站长或同步到其他设备。</p></div>
      <form @submit.prevent="submit">
        <label class="field-label" for="guest-name">怎么称呼你 <span>*</span></label><input id="guest-name" v-model="name" class="field" type="text" autocomplete="nickname" placeholder="留下你的昵称" maxlength="24" required />
        <label class="field-label" for="guest-content">想说的话 <span>*</span></label><textarea id="guest-content" v-model="content" class="field" rows="5" placeholder="你好呀，很高兴在这里遇见你…" maxlength="500" required></textarea>
        <div class="message-toolbar"><div class="emoji-buttons"><button v-for="item in ['🌸', '✨', '☕', '🍀', '💖']" :key="item" type="button" @click="emoji(item)" :aria-label="`插入表情 ${item}`">{{ item }}</button></div><span>{{ content.length }} / 500</span></div>
        <div class="message-submit"><span>让每一次路过，都留下一点温度。</span><button type="submit" class="btn" :disabled="!ready"><span class="icon-[lucide--send]"></span>保存留言</button></div>
        <p class="form-feedback" role="status">{{ feedback }}</p><p v-if="error" class="form-error" role="alert">{{ error }}</p>
      </form>
    </section>
    <section class="card page-card saved-messages">
      <h2 class="panel-title"><span class="icon-[lucide--messages-square]"></span>我的留言<span class="message-count">{{ messages.length }}</span></h2>
      <div v-if="!messages.length" class="empty-state"><span class="icon-[lucide--mail-open]"></span><h3>第一句问候，留给你</h3><p>写下今天的心情，收藏这个相遇的瞬间。</p></div>
      <article v-for="message in messages" :key="message.id" class="message">
        <div class="message-avatar">{{ Array.from(message.name)[0] }}</div>
        <div class="message-main"><div class="message-byline"><strong>{{ message.name }}</strong><span>仅自己可见</span><button @click="remove(message.id)" :aria-label="`删除 ${message.name} 的留言`">删除</button></div><time :datetime="message.date">{{ dateLabel(message.date) }}</time><p>{{ message.content }}</p></div>
      </article>
    </section>
  </div>
</template>
<style scoped>
.local-notice { display: flex; align-items: flex-start; gap: 8px; background: var(--accent-soft); padding: 12px 14px; border-radius: 10px; margin-bottom: 24px; color: var(--accent); font-size: 11px; }
.local-notice > span { flex-shrink: 0; margin-top: 4px; }
.local-notice p { margin: 0; }
.field-label { display: block; margin: 18px 0 9px; font-size: 13px; }
.field-label span { color: var(--accent); }
textarea { resize: vertical; min-height: 140px; }
.message-toolbar { display: flex; align-items: center; justify-content: space-between; margin: 9px 0 20px; }
.message-toolbar > span { color: var(--muted); font-size: 11px; font-family: "Oxanium-Medium"; }
.emoji-buttons { display: flex; gap: 6px; }
.emoji-buttons button { background: var(--accent-soft); border: 0; width: 29px; height: 29px; border-radius: 8px; font-size: 15px; }
.emoji-buttons button:hover { transform: translateY(-2px); }
.message-submit { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.message-submit > span { font-size: 10px; color: var(--muted); }
.message-submit .btn { font-size: 12px; flex-shrink: 0; }
.form-feedback, .form-error { font-size: 12px; margin: 12px 0 0; }
.form-feedback:empty { display: none; }
.form-feedback { color: var(--accent); }
.form-error { color: #c65d69; }
.saved-messages { margin-top: 20px; }
.message-count { margin-left: auto; background: var(--accent-soft); color: var(--accent); font: 12px "Oxanium-Medium"; padding: 3px 8px; border-radius: 5px; }
.message { display:flex; gap: 12px; border-top: 1px solid var(--line); padding: 22px 0; }
.message:last-child { padding-bottom: 0; }
.message-avatar { flex-shrink: 0; width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); }
.message-main { flex: 1; min-width: 0; }
.message-byline { display: flex; align-items: center; gap: 10px; }
.message-byline strong { font-size: 13px; font-weight: 400; }
.message-byline > span { font-size: 9px; color: var(--accent); }
.message-byline button { border: 0; background: none; color: var(--muted); font-size: 10px; margin-left: auto; }
.message-byline button:hover { color: var(--accent); }
.message time { color: var(--muted); font-size: 10px; }
.message-main > p { font-family: system-ui, sans-serif; font-size: 13px; white-space: pre-wrap; line-height: 1.9; margin: 10px 0 0; }
@media(max-width:480px) { .message-submit > span { max-width: 115px; } }
</style>