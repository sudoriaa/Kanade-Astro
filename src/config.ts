// 网站基本信息
export const siteInfo = {
  title: "Kanade",
  description: "Kanade A Blog built with Astro.",
  keywords: ["astro", "kanade", "blog", "Sudoria"],
}

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