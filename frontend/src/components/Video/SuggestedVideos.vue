<script setup lang="ts">
  import { onMounted, ref, reactive } from "vue";
  import { useVideoStore } from "@/stores/video";
  import { RouterLink } from "vue-router";

  // stores
  const videoStore = useVideoStore()

  const suggestedVideos = reactive(Array<object>())

  const loaded = ref(false)

  onMounted(async () => {
    const result:Array<object> = await videoStore.getSuggestedVideos()

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
          <img class="w-full object-cover overflow-hidden" :src="video.get_thumbnail">
        </div>
        <div class="py-4">
          <div class="font-bold text-base mb-2 break-words w-80">{{ video.name }}</div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/style/videos-mtaccount.css");
</style>