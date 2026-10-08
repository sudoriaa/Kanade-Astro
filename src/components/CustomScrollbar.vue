<template>
  <div
    v-if="showScrollbar"
    ref="scrollbarThumb"
    class="custom-scrollbar-thumb"
    :class="{
      'is-dragging': isDragging,
      'dark-mode': isDark,
      'is-visible': isMouseInPage || isDragging,
    }"
    :style="thumbStyle"
    @mousedown="startDrag"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const scrollbarThumb = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const scrollPercentage = ref(0);
const thumbHeight = ref(0);
const startY = ref(0);
const startScrollTop = ref(0);
const showScrollbar = ref(false);
const isDark = ref(false);
const isMouseInPage = ref(false);
let initializationTimer: ReturnType<typeof setTimeout> | undefined;
let contentObserver: MutationObserver | undefined;
let themeObserver: MutationObserver | undefined;

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translateY(${scrollPercentage.value}px) ${isMouseInPage.value || isDragging.value ? "translateX(0)" : "translateX(20px)"}`,
}));

// Update the theme state.
const updateThemeState = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

const updateScrollbar = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = window.scrollY;

  // Show the scrollbar only when the content exceeds the viewport.
  showScrollbar.value = scrollHeight > clientHeight;

  if (!showScrollbar.value) return;

  // Navigation height: 64px (h-16 = 4rem = 64px).
  const navHeight = 64;
  const availableHeight = clientHeight - navHeight;

  // Calculate the scrollbar height.
  const viewportRatio = availableHeight / scrollHeight;
  thumbHeight.value = Math.max(availableHeight * viewportRatio, 50);

  // Calculate the scrollbar position.
  const maxScroll = scrollHeight - clientHeight;
  const maxThumbPosition = availableHeight - thumbHeight.value;
  scrollPercentage.value =
    maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbPosition : 0;
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startY.value = e.clientY;
  startScrollTop.value = window.scrollY;
  document.body.style.userSelect = "none";
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const deltaY = e.clientY - startY.value;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const maxScroll = scrollHeight - clientHeight;
  const maxThumbPosition = clientHeight - 64 - thumbHeight.value;
  if (maxThumbPosition <= 0) return;

  const scrollDelta = (deltaY / maxThumbPosition) * maxScroll;
  window.scrollTo(0, startScrollTop.value + scrollDelta);
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.userSelect = "";
};

const handleMouseEnter = () => {
  isMouseInPage.value = true;
};

const handleMouseLeave = () => {
  isMouseInPage.value = false;
};

onMounted(() => {
  // Initialize after the page finishes loading.
  initializationTimer = setTimeout(() => {
    updateScrollbar();
    updateThemeState();
  }, 100);

  window.addEventListener("scroll", updateScrollbar);
  window.addEventListener("resize", updateScrollbar);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
  document.addEventListener("mouseenter", handleMouseEnter);
  document.addEventListener("mouseleave", handleMouseLeave);

  // Observe DOM changes.
  contentObserver = new MutationObserver(updateScrollbar);
  contentObserver.observe(document.body, { childList: true, subtree: true });

  // Observe theme changes.
  themeObserver = new MutationObserver(() => {
    updateThemeState();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onUnmounted(() => {
  clearTimeout(initializationTimer);
  contentObserver?.disconnect();
  themeObserver?.disconnect();
  if (isDragging.value) stopDrag();
  window.removeEventListener("scroll", updateScrollbar);
  window.removeEventListener("resize", updateScrollbar);
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("mouseenter", handleMouseEnter);
  document.removeEventListener("mouseleave", handleMouseLeave);
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
  transition:
    width 0.2s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
  opacity: 0;
  transform: translateX(20px);
  pointer-events: auto;

  /* Light theme */
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

/* Dark theme */
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
