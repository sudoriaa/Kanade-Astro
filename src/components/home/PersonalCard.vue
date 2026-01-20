<script lang="ts" setup>
import { personalInfo } from '../../config';
import SocialLinkIcon from './SocialLinkIcon.vue';


</script>

<template>
    <div class="flex flex-col relative bg-kanadeBoxLight dark:bg-kanadeBoxDark w-full rounded-2xl">
        <!-- <div class="absolute top-[-10%] left-[50%] transform translate-x-[-50%] max-h-[80%] w-6/7 rounded-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            
        </div> -->
        <div class="flex">
            <div class="w-24 h-24 m-4">
                <img src="/images/sudoria.jpg" class="h-full rounded-lg" />
            </div>
            <div class="flex flex-col justify-center">
                <h2 class="text-2xl font-Oxanium-Medium">苏多莉亚</h2>
                <p class="text-subTextLight dark:text-subTextDark">全栈工程师</p>
                <ul class="mt-2">
                        <li v-for="link in personalInfo.socialLinks" :key="link.url" class="inline-block">
                            <a :href="link.url" target="_blank" rel="noopener noreferrer">
                                    <span class="text-2xl bg-subTextLight dark:bg-subTextDark" :class="link.icon"></span>
                            </a>
                        </li>
                    </ul>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="bg-subBoxLight/40 dark:bg-subBoxDark/40 m-2 p-2 rounded-full text-sm text-subTextLight dark:text-subTextDark">
                你好，世界！
            </div>
        </div>



    </div>

</template>


<style scoped></style>