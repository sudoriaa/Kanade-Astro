<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 波浪颜色 - 使用 ref 存储当前颜色值
const waveColor1 = ref('')
const waveColor2 = ref('')
const waveColor3 = ref('')

// 更新波浪颜色
const updateWaveColors = () => {
  const isDark = document.documentElement.classList.contains('dark')
  if (isDark) {
    waveColor1.value = 'rgba(0,0,0,0.7)'
    waveColor2.value = 'rgba(0,0,0,0.5)'
    waveColor3.value = '#000'
  } else {
    waveColor1.value = 'rgba(255,255,255,0.7)'
    waveColor2.value = 'rgba(255,255,255,0.5)'
    waveColor3.value = '#fff'
  }
}

// 监听主题变化
let observer = null

onMounted(() => {
  // 立即更新一次
  updateWaveColors()
  
  // 监听 html 元素的 class 变化
  observer = new MutationObserver(() => {
    updateWaveColors()
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>


<template>
  <div class="w-full overflow-hidden leading-none">
    <!-- 波浪 SVG -->
    <svg
      class="relative w-full h-[15vh] min-h-[100px] max-h-[150px] -mb-[7px]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
        />
      </defs>

      <g class="parallax">
        <use href="#gentle-wave" x="48" y="0" :fill="waveColor1" />
        <use href="#gentle-wave" x="48" y="3" :fill="waveColor2" />
        <use href="#gentle-wave" x="48" y="7" :fill="waveColor3" />
      </g>
    </svg>
  </div>
</template>


<style scoped>
.parallax > use {
  animation: move-forever 12s linear infinite;
}

.parallax > use:nth-child(1) {
  animation-duration: 8s;
}
.parallax > use:nth-child(2) {
  animation-duration: 12s;
}
.parallax > use:nth-child(3) {
  animation-duration: 16s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@media (max-width: 768px) {
  svg {
    height: 40px;
    min-height: 40px;
  }
}
</style>
