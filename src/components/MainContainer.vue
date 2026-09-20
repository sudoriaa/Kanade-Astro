<script setup lang="ts">
</script>


<template>
  <div class="flex flex-col">
    <div class="main-container flex-1 relative text-kanadeDark bg-kanadeLight dark:bg-kanadeDark dark:text-kanadeLight"
    >
      <slot />
    </div>
    
    
  </div>
</template>

<style scoped>
.main-container {
  min-height: 40vh;
  color: var(--text);
  background: var(--bg);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
</style>
