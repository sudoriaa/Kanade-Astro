import { withBase } from "./lib/urls";
export const siteInfo = {
  title: "Kanade",
  description: "一个记录热爱与日常的示例博客。分享前端开发、折腾日常，以及生活里闪闪发光的片刻。",
  keywords: ["Astro", "Kanade", "博客", "Kanade Author", "前端开发"],
  // 发布到域名时设置 SITE_URL，例如 https://example.com。
  url: import.meta.env.SITE_URL || "http://localhost:4321",
};

export const headerConfig = {
  title: "Kanade",
  navLinks: [
    { name: "首页", icon: "icon-[bx--bxs-home-circle]", url: withBase("/") },
    { name: "文章", icon: "icon-[material-symbols--article]", url: withBase("/posts/") },
    { name: "留言", icon: "icon-[basil--comment-solid]", url: withBase("/messages/") },
    { name: "友链", icon: "icon-[mingcute--link-3-line]", url: withBase("/friends/") },
    { name: "关于", icon: "icon-[mynaui--indifferent-ghost-solid]", url: withBase("/about/") },
  ],
};

export const welcomeConfig = {
  title: "欢迎来到 Kanade",
  subTitle: "把热爱写进代码，把日常收藏成诗。",
  bgImage: withBase("/images/hero.webp"),
};

export const personalInfo = {
  name: "示例作者",
  englishName: "Kanade Author",
  avatar: withBase("/images/avatar.svg"),
  role: "记录热爱的人",
  bio: "在代码与生活之间，寻找一点小小的浪漫。",
  github: "https://github.com",
  socialLinks: [
    { name: "GitHub", icon: "icon-[jam--github]", url: "https://github.com" },
    { name: "RSS 订阅", icon: "icon-[lucide--rss]", url: withBase("/rss.xml") },
    { name: "留言板", icon: "icon-[lucide--mail]", url: withBase("/messages/") },
  ],
};