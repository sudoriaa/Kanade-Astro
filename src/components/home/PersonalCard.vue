<script setup lang="ts">
import { personalInfo } from "../../config";
import { getTags, type PostSummary } from "../../lib/posts";
const props = defineProps<{ posts: PostSummary[] }>();
</script>
<template>
  <section class="card profile-card">
    <div class="profile-top"><span class="profile-flower">✿</span><span class="eyebrow">NICE TO MEET YOU</span><span class="profile-spark">✧</span></div>
    <a href="/about/" class="avatar-link"><img :src="personalInfo.avatar" :alt="personalInfo.name" width="80" height="80" /><span class="online-dot" title="持续记录中"></span></a>
    <h2>{{ personalInfo.name }}</h2><p class="profile-role">{{ personalInfo.role }}</p>
    <p class="profile-bio">{{ personalInfo.bio }}</p>
    <div class="profile-stats"><a href="/posts/"><strong>{{ posts.length }}</strong><span>文章</span></a><a href="/posts/"><strong>{{ new Set(posts.map(p => p.category)).size }}</strong><span>分类</span></a><a href="/posts/#tags"><strong>{{ getTags(props.posts).length }}</strong><span>标签</span></a></div>
    <div class="profile-social"><a v-for="link in personalInfo.socialLinks" :key="link.url" :href="link.url" :target="link.url.startsWith('https') ? '_blank' : undefined" rel="noopener noreferrer" :aria-label="link.name" :title="link.name"><span :class="link.icon"></span></a></div>
    <div class="profile-status"><span></span>保持热爱，奔赴下一场山海</div>
  </section>
</template>
<style scoped>
.profile-card { text-align: center; padding: 0 19px 16px; overflow: hidden; }
.profile-top { margin: 0 -19px; height: 60px; display: flex; align-items: center; justify-content: center; gap: 12px; background: linear-gradient(115deg, var(--accent-soft), var(--card)); color: var(--accent); }
.profile-top .eyebrow { font-size: 8px; letter-spacing: .14em; }
.profile-flower { font-size: 24px; opacity: .55; }
.profile-spark { font-size: 22px; opacity: .7; }
.avatar-link { position: relative; display: block; width: 83px; margin: -5px auto 10px; }
.avatar-link img { width: 83px; height: 83px; border-radius: 26px; border: 4px solid var(--card); box-shadow: 0 3px 10px #98637a15; object-fit: cover; transition: transform .3s; }
.avatar-link:hover img { transform: rotate(-5deg); }
.online-dot { position: absolute; bottom: 3px; right: 3px; width: 13px; height: 13px; border-radius: 50%; border: 3px solid var(--card); background: #96bf99; }
h2 { margin: 7px 0 1px; font-size: 20px; font-weight: 600; letter-spacing: .04em; }
.profile-role { margin: 0; color: var(--accent); font-size: 11px; }
.profile-bio { margin: 15px 0; color: var(--muted); font-size: 11px; line-height: 1.9; }
.profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); padding: 0 0 14px; border-bottom: 1px dashed var(--line); }
.profile-stats a { display: flex; flex-direction: column; gap: 2px; }
.profile-stats a:hover { color: var(--accent); }
.profile-stats strong { font: 19px "Oxanium-Medium", sans-serif; }
.profile-stats span { color: var(--muted); font-size: 10px; }
.profile-social { display: flex; align-items: center; justify-content: center; gap: 17px; margin: 15px 0; }
.profile-social a { background: var(--accent-soft); color: var(--accent); width: 31px; height: 31px; border-radius: 10px; display: grid; place-items: center; font-size: 17px; }
.profile-social a:hover { transform: translateY(-3px); }
.profile-status { border-radius: 8px; background: var(--accent-soft); color: var(--accent); font-size: 9px; padding: 7px 4px; display: flex; align-items: center; justify-content: center; gap: 5px; }
.profile-status > span { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
</style>