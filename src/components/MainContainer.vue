<script setup lang="ts">
</script>


<template>
  <div class="min-h-screen flex flex-col">
    <!-- 主要内容区域，flex-1让它占据剩余空间 -->
    <div class="main-container flex-1 relative text-gray-800 bg-[#fcf2f4] dark:bg-[#030812] dark:text-white"
    >
      <slot />
    </div>
    
    
  </div>
</template>

<style scoped>
.main-container {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
</style>
