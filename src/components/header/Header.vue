<!-- src/components/Header.vue -->
<script setup lang="ts">
// 导入配置
import { headerConfig } from '../../config';

// 响应式状态
import { ref } from 'vue';

// 移动端菜单状态
const isMobileMenuOpen = ref(false);

// 关闭移动端菜单
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};
</script>

<template>
    <!-- 主头部 -->
    <header class="fixed flex items-center w-screen top-0 z-50 h-16 bg-amber-800 text-white shadow-lg">
        <div class="flex items-center w-7xl m-auto justify-between">
            <!-- Logo 区域 -->
            <div class="flex items-center space-x-3">
                <a href="/" class="flex items-center space-x-2 group">
                    <div>
                        <h1
                            class="text-2xl font-bold tracking-tight group-hover:text-amber-200 transition-colors duration-300">
                            {{ headerConfig.title }}
                        </h1>
                    </div>
                </a>
            </div>

            <!-- 桌面端导航链接 -->
            <nav class="flex-1 flex justify-center">
                <ul class="flex items-center space-x-1">
                    <li v-for="item in headerConfig.navLinks" :key="item.name" class="relative text-xl">
                        <a :href="item.url" class="inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300
         group/nav-item relative">
                            <!-- 图标 -->
                            <span v-if="item.icon" :class="item.icon" class="inline-flex items-center justify-center"
                                style="font-size: 1.1em; width: 1.1em; height: 1.1em; line-height: 1;"></span>

                            <!-- 文字 -->
                            <span class="font-medium whitespace-nowrap leading-none text-base">
                                {{ item.name }}
                            </span>

                            <!-- 底部指示线 -->
                            <span class="absolute bottom-1 left-1/4 right-1/4 h-0.5 bg-white rounded-full
           scale-x-0 group-hover/nav-item:scale-x-100 group-hover/nav-item:left-2 group-hover/nav-item:right-2
           origin-center transition-all duration-300"></span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- 右侧功能区 -->
            <div class="flex items-center space-x-4">
                <!-- 搜索框 -->
                <div class="relative">
                    <input type="text" placeholder="搜索..." class="w-48 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full
                   text-white placeholder-white/60 focus:outline-none focus:ring-2 
                   focus:ring-white/30 focus:border-transparent transition-all" />
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                        <span class="i-mdi-magnify w-5 h-5"></span>
                    </div>
                </div>

                <!-- 主题切换按钮 -->
                <button class="p-2 rounded-full hover:bg-white/10 transition-colors duration-200" aria-label="切换主题">
                    <span class="i-mdi-white-balance-sunny w-6 h-6"></span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>