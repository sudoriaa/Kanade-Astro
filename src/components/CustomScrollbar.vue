<template>
  <div 
    v-if="showScrollbar"
    ref="scrollbarThumb" 
    class="custom-scrollbar-thumb"
    :class="{ 'is-dragging': isDragging, 'dark-mode': isDark, 'is-visible': isMouseInPage || isDragging }"
    :style="thumbStyle"
    @mousedown="startDrag"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const scrollbarThumb = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const scrollPercentage = ref(0);
const thumbHeight = ref(0);
const startY = ref(0);
const startScrollTop = ref(0);
const showScrollbar = ref(false);
const isDark = ref(false);
const isMouseInPage = ref(false);

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translateY(${scrollPercentage.value}px) ${isMouseInPage.value || isDragging.value ? 'translateX(0)' : 'translateX(20px)'}`,
}));

// 更新主题状态
const updateThemeState = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

const updateScrollbar = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = window.scrollY;

  // 只在内容超出视口时显示滚动条
  showScrollbar.value = scrollHeight > clientHeight;

  if (!showScrollbar.value) return;

  // 导航栏高度 64px (h-16 = 4rem = 64px)
  const navHeight = 64;
  const availableHeight = clientHeight - navHeight;

  // 计算滚动条高度
  const viewportRatio = availableHeight / scrollHeight;
  thumbHeight.value = Math.max(availableHeight * viewportRatio, 50);

  // 计算滚动条位置
  const maxScroll = scrollHeight - clientHeight;
  const maxThumbPosition = availableHeight - thumbHeight.value;
  scrollPercentage.value = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbPosition : 0;
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startY.value = e.clientY;
  startScrollTop.value = window.scrollY;
  document.body.style.userSelect = 'none';
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const deltaY = e.clientY - startY.value;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const maxScroll = scrollHeight - clientHeight;
  const maxThumbPosition = clientHeight - thumbHeight.value;

  const scrollDelta = (deltaY / maxThumbPosition) * maxScroll;
  window.scrollTo(0, startScrollTop.value + scrollDelta);
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.userSelect = '';
};

const handleMouseEnter = () => {
  isMouseInPage.value = true;
};

const handleMouseLeave = () => {
  isMouseInPage.value = false;
};

onMounted(() => {
  // 延迟初始化，确保页面完全加载
  setTimeout(() => {
    updateScrollbar();
    updateThemeState();
  }, 100);
  
  window.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  document.addEventListener('mouseenter', handleMouseEnter);
  document.addEventListener('mouseleave', handleMouseLeave);
  
  // 监听 DOM 变化
  const observer = new MutationObserver(updateScrollbar);
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 监听主题变化
  const themeObserver = new MutationObserver(() => {
    updateThemeState();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollbar);
  window.removeEventListener('resize', updateScrollbar);
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('mouseenter', handleMouseEnter);
  document.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<style scoped>
.custom-scrollbar-thumb {
  position: fixed;
  right: 4px;
  top: 64px;
  width: 6px;
  border-radius: 10px;
  cursor: pointer;
  z-index: 40;
  transition: width 0.2s ease, opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateX(20px);
  pointer-events: auto;
  
  /* 浅色模式 */
  background: linear-gradient(135deg, #ff9ec8 0%, #ffb8d9 50%, #ffc9e5 100%);
  box-shadow: 0 2px 6px rgba(255, 158, 200, 0.5);
}

.custom-scrollbar-thumb.is-visible {
  opacity: 0.6;
  transform: translateX(0);
}

.custom-scrollbar-thumb:hover,
.custom-scrollbar-thumb.is-dragging {
  width: 10px;
  opacity: 1 !important;
  background: linear-gradient(135deg, #ff7eb3 0%, #ff9ec8 50%, #ffb8d9 100%);
  box-shadow: 0 4px 12px rgba(255, 126, 179, 0.5);
}

/* 深色模式 */
.custom-scrollbar-thumb.dark-mode {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
}

.custom-scrollbar-thumb.dark-mode:hover,
.custom-scrollbar-thumb.dark-mode.is-dragging {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.6);
}
</style>
