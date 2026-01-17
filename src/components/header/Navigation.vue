<script setup lang="ts">
import { headerConfig } from '../../config';
import { ref, onMounted, onUnmounted } from 'vue'
import { initTheme, toggleTheme as toggle } from '../../scripts/theme';

// 是否为深色模式 - 直接读取 DOM 状态
const isDark = ref(false);

// 更新主题状态
const updateThemeState = () => {
    isDark.value = document.documentElement.classList.contains('dark');
}

// 切换主题
const handleToggleTheme = () => {
    toggle();
    updateThemeState();
}

// 监听滚动以改变导航栏样式
const isAtTop = ref(true)

const handleScroll = () => {
    isAtTop.value = window.scrollY <= 16 * 4;
}

// MutationObserver 监听 dark 类变化
let observer: MutationObserver | null = null;

onMounted(() => {
    // 初始化主题
    initTheme();
    updateThemeState();
    
    // 监听 html 元素的 class 变化
    observer = new MutationObserver(() => {
        updateThemeState();
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    observer?.disconnect();
})

</script>

<template>
    <!-- 主头部 -->
    <header class="nav-header fixed flex items-center w-screen top-0 z-50 h-16 shadow-lg px-4 text-shadow-md dark:text-kanadelight" 
         :class="[
            isAtTop ? 'bg-transparent shadow-none text-kanadelight' : 'bg-kanadelight/50 dark:bg-kanadedark/50',
            isAtTop ? '' : 'backdrop-blur'
        ]">
        <div class="flex items-center w-7xl m-auto justify-between">
            <!-- Logo 区域 -->
            <div class="flex items-center space-x-3">
                <a href="/" class="flex items-center space-x-2 group">
                    <div>
                        <h1
                            class="text-2xl font-bold tracking-tight group-hover:text-amber-200 transition-all duration-500">
                            {{ headerConfig.title }}
                        </h1>
                    </div>
                </a>
            </div>

            <!-- 桌面端导航链接 -->
            <nav class="flex-1 flex justify-center">
                <ul class="flex items-center space-x-1">
                    <li v-for="item in headerConfig.navLinks" :key="item.name" class="relative text-xl">
                        <a :href="item.url" class="inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-500
         group/nav-item relative">
                            <!-- 图标 -->
                            <span v-if="item.icon" :class="item.icon" class="inline-flex items-center justify-center"
                                style="font-size: 1.1em; width: 1.1em; height: 1.1em; line-height: 1;"></span>

                            <!-- 文字 -->
                            <span class="font-medium whitespace-nowrap leading-none text-base">
                                {{ item.name }}
                            </span>

                            <!-- 底部指示线 -->
                            <span class="absolute bottom-1 left-1/4 right-1/4 h-0.5 bg-kanadelight rounded-full
           scale-x-0 group-hover/nav-item:scale-x-100 group-hover/nav-item:left-2 group-hover/nav-item:right-2
           origin-center transition-all duration-300"></span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- 右侧功能区 -->
            <div class="flex items-center space-x-4">
                <!-- 主题切换按钮 -->
                <button
                    class="flex items-center justify-center cursor-pointer p-2 rounded hover:bg-kanadelight/10 transition-colors duration-200 relative w-10 h-10"
                    aria-label="切换主题" @click="handleToggleTheme">
                    <!-- 太阳图标 (浅色模式时显示，点击切换到深色) -->
                    <span
                        class="icon-[line-md--sun-rising-loop] text-2xl absolute transition-all duration-300 ease-in-out"
                        :class="[
                            !isDark
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-0'
                        ]"></span>
                    <!-- 月亮图标 (深色模式时显示，点击切换到浅色) -->
                    <span
                        class="icon-[line-md--moon-filled-alt-loop] text-2xl absolute transition-all duration-300 ease-in-out"
                        :class="[
                            isDark
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-0'
                        ]"></span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* 导航栏背景和颜色过渡 */
.nav-header {
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* Logo 悬停效果 */
h1 {
  transition: color 0.5s ease-in-out;
}

/* 导航链接悬停效果 */
nav a {
  transition: all 0.5s ease-in-out;
}

/* 底部指示线动画 */
nav a span:last-child {
  transition: all 0.3s ease-in-out;
}

/* 主题切换按钮 */
button {
  transition: background-color 0.2s ease-in-out;
}

/* 主题切换图标动画 */
.icon-\[line-md--sun-rising-loop\],
.icon-\[line-md--moon-filled-alt-loop\] {
  transition: opacity 0.3s ease-in-out, scale 0.3s ease-in-out !important;
}
</style>