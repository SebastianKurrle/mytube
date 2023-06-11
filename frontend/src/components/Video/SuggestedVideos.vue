<script setup lang="ts">
  import { onMounted, ref, reactive } from "vue";
  import { useVideoStore } from "@/stores/video";
  import {RouterLink } from "vue-router";

  // stores
  const videoStore = useVideoStore()

  const suggestedVideos = reactive(Array<any>())

  const loaded = ref(false)

  onMounted(async () => {
    const result:Array<any> = await videoStore.getSuggestedVideos()

    result.map(video => {
      suggestedVideos.push(video)
    })

    loaded.value = true
  })

</script>

<template>
  <div v-if="loaded" class="mt-3 video-container">
    <div class="max-w-md rounded overflow-hidden video-item text-white" v-for="video in suggestedVideos">
      <RouterLink :to="{ name: 'video', params: {id: video.id} }">
        <div class="thumbnail-preview">
          <img class="w-full object-cover overflow-hidden" :src="video.get_thumbnail" alt="Thumbnail">
        </div>
        <div class="py-4 flex items-center max-w-[85]">
          <img :src="video.mt_account.get_prof_picture" class="w-16 h-16 rounded-full overflow-hidden object-cover" alt="Profile picture">
          <div class="font-bold text-base mb-2 ml-3 max-w-[65%] truncate">
            <span class="text-sm break-words">{{ video.name }}</span>
            <RouterLink :to="{ name: 'mytube-account-detail', params: { mtaccountName: video.mt_account.name } }"><p class="text-sm font-light text-gray-400">{{ video.mt_account.name }}</p></RouterLink>
            <p class="text-sm font-light text-gray-400">{{ video.calls }} Views - {{ videoStore.getTimeAgoFromVideo(video.datetime_posted) }}</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/style/videos-mtaccount.css");
</style>