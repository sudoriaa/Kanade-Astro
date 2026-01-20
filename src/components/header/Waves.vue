<script setup>

</script>


<template>
  <div class="w-full overflow-hidden leading-none">
    <!-- 波浪 SVG -->
    <svg class="relative w-full h-[15vh] min-h-[100px] max-h-[150px] -mb-[7px]" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
      </defs>

      <g class="parallax">
        <use href="#gentle-wave" x="48" y="0" class="wave-layer fill-kanadeLight/70 dark:fill-kanadeDark/70" />
        <use href="#gentle-wave" x="48" y="3" class="wave-layer fill-kanadeLight/50 dark:fill-kanadeDark/50" />
        <use href="#gentle-wave" x="48" y="7" class="wave-layer fill-kanadeLight dark:fill-kanadeDark" />
      </g>

    </svg>
  </div>
</template>


<style scoped>
.wave-layer {
  transition: fill 0.3s ease-in-out;
}

.parallax>use {
  animation: move-forever 12s linear infinite;
}

.parallax>use:nth-child(1) {
  animation-duration: 8s;
}

.parallax>use:nth-child(2) {
  animation-duration: 12s;
}

.parallax>use:nth-child(3) {
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
