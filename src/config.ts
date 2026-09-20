export const siteInfo = {
  title: "Kanade",
  description: "苏多莉亚的小小记录站。分享前端开发、折腾日常，以及生活里闪闪发光的片刻。",
  keywords: ["Astro", "Kanade", "博客", "Sudoria", "前端开发"],
  // 发布到域名时设置 SITE_URL，例如 https://your-blog.example。
  url: import.meta.env.SITE_URL || "http://localhost:4321",
};

export const headerConfig = {
  title: "Kanade",
  navLinks: [
    { name: "首页", icon: "icon-[bx--bxs-home-circle]", url: "/" },
    { name: "文章", icon: "icon-[material-symbols--article]", url: "/posts/" },
    { name: "留言", icon: "icon-[basil--comment-solid]", url: "/messages/" },
    { name: "友链", icon: "icon-[mingcute--link-3-line]", url: "/friends/" },
    { name: "关于", icon: "icon-[mynaui--indifferent-ghost-solid]", url: "/about/" },
  ],
};

export const welcomeConfig = {
  title: "欢迎来到 Kanade",
  subTitle: "把热爱写进代码，把日常收藏成诗。",
  bgImage: "/images/hero.webp",
};

export const personalInfo = {
  name: "苏多莉亚",
  englishName: "Sudoria",
  avatar: "/images/sudoria.jpg",
  role: "全栈工程师",
  bio: "在代码与生活之间，寻找一点小小的浪漫。",
  github: "https://github.com/sudoriaa",
  socialLinks: [
    { name: "GitHub", icon: "icon-[jam--github]", url: "https://github.com/sudoriaa" },
    { name: "RSS 订阅", icon: "icon-[lucide--rss]", url: "/rss.xml" },
    { name: "留言板", icon: "icon-[lucide--mail]", url: "/messages/" },
  ],
};