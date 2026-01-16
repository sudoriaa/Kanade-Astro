<script setup lang="ts">


 
const props = defineProps({
    mode: {
        type: String,
        default: 'light',
        validator: (v: string) => ['light', 'dark'].includes(v),
    },
});
</script>


<template>
  <div class="min-h-screen flex flex-col">
    

    <!-- 主要内容区域，flex-1让它占据剩余空间 -->
    <div class="flex-1 relative"
        :class="mode === 'dark' ? 'text-white bg-black' : 'text-gray-800 bg-white'">
      <!-- 你的主要内容放在这里 -->

    </div>
    
    
  </div>
</template>
