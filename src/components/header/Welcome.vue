<script lang="ts" setup>
import { welcomeConfig } from '../../config';
import Waves from '../Waves.vue';


</script>


<template>
    <div class="relative text-center h-[60dvh] flex flex-col justify-center items-center
    bg-cover bg-center before:absolute before:inset-0 before:bg-black/30 before:z-0"
     :style="{ backgroundImage: `url('${welcomeConfig.bgImage}')` }">
        <div class="flex flex-col">
            <h1 class="">{{ welcomeConfig.title }}</h1>
            <p class="">{{ welcomeConfig.subTitle }}</p>
        </div>
        
        <Waves class="absolute bottom-0 left-0 w-full"/>
    </div>

    
</template>

<style scoped></style>