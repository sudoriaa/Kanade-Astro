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
        <use :href="waveId" x="48" y="0" :fill="waveColors[0]" />
        <use :href="waveId" x="48" y="3" :fill="waveColors[1]" />
        <use :href="waveId" x="48" y="7" :fill="waveColors[2]" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/** props */
const props = defineProps({
  mode: {
    type: String,
    default: 'light',
    validator: v => ['light', 'dark'].includes(v),
  },
})

const waveId = '#gentle-wave'

/** 根据 mode 返回不同波浪颜色 */
const waveColors = computed(() => {
  if (props.mode === 'dark') {
    return [
      'rgba(0,0,0,0.7)',
      'rgba(0,0,0,0.5)',
      '#000',
    ]
  }
  // light
  return [
    'rgba(255,255,255,0.7)',
    'rgba(255,255,255,0.5)',
    '#fff',
  ]
})
</script>

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
