// 网站基本信息
export const siteInfo = {
  title: "Kanade",
  description: "Kanade A Blog built with Astro.",
  keywords: ["astro", "kanade", "blog", "Sudoria"],
}

// 导航栏配置
export const headerConfig = {
    title: "Kanade",
    logo: "/src/assets/logo.png",
    navLinks: [
        { name: "首页", icon:"icon-[bx--bxs-home-circle]",url: "/" },
        { name: "文章", icon:"icon-[material-symbols--article]", url: "/posts" },
        { name: "留言", icon:"icon-[basil--comment-solid]", url: "/messages" },
        { name: "友链", icon:"icon-[mingcute--link-3-line]", url: "/friends" },
        { name: "关于", icon:"icon-[mynaui--indifferent-ghost-solid]", url: "/about" },
    ],
    search: true,  // 是否启用搜索功能
    lightAndDarkMode: true,  // 是否启用浅色和深色模式切换
    githubLink: "",  // GitHub 链接(留空则不显示)
}

// 欢迎板块配置
export const welcomeConfig = {
    title: "欢迎来到 Kanade",
    subTitle: "这是一个由 Astro 构建的博客网站。",
    bgImage: "https://img2.huashi6.com/images/resource/thumbnail/2025/02/09/23269_76985257670.jpg?imageMogr2/quality/75/interlace/1/thumbnail/x942/gravity/Center/crop/1400x942/format/webp%7Cwatermark/2/text/6Kem56uZQFpVVQ/gravity/South/fill/I2ZmZmZmZg/fontsize/400/font/5b6u6L2v6ZuF6buR/dy/20",
}