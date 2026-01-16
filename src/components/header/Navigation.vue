<script setup lang="ts">
import { headerConfig } from '../../config';
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    mode: {
        type: String,
        default: 'light',
        validator: (v: string) => ['light', 'dark'].includes(v),
    },
});
// 主题颜色
const darkTheme = {
    textColor: 'text-white',
    bgColor: 'bg-black/50', // 半透明黑色
}
const lightTheme = {
    textColor: 'text-black',
    bgColor: 'bg-white/50', // 半透明白色
}


// 监听滚动以改变导航栏样式
const isAtTop = ref(true)

const handleScroll = () => {
    isAtTop.value = window.scrollY <= 16*4;
    console.log('Scroll Y:', window.scrollY, 'isAtTop:', isAtTop.value);
}





onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化时检查位置
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
    <!-- 主头部 -->
    <header class="fixed flex items-center w-screen top-0 z-50 h-16 shadow-lg px-4 transition-all duration-500 text-shadow-md" 
    :class="[
        mode === 'dark' ? darkTheme.textColor : lightTheme.textColor,
        isAtTop ? 'bg-transparent shadow-none' : mode === 'dark' ? darkTheme.bgColor : lightTheme.bgColor,
        isAtTop ? '' : 'backdrop-blur'
    ]">
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
                <!-- 主题切换按钮 -->
                <button class="p-2 rounded-full hover:bg-white/10 transition-colors duration-200" aria-label="切换主题">
                    <span class="i-mdi-white-balance-sunny w-6 h-6">12</span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped></style>