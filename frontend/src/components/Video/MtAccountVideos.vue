<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue';
    import { RouterLink } from 'vue-router';
    import { useVideoStore } from '@/stores/video';
    import type { VideoCALL } from '@/assets/interfaces';

    const props = defineProps(['mtaccount'])

    // stores
    const videoStore = useVideoStore()

    const loaded = ref(false)

    const mtaccount = ref(props.mtaccount)
    const videos = reactive(Array<VideoCALL>())

    onMounted(async () => {
        const result = await videoStore.getVideosFromMtAccount(mtaccount.value.id)

        result.map(video => {
            videos.push(video)
        })

        loaded.value = true
    })
</script>

<template>
    <div v-if="loaded" class="mt-3 video-container">
        <div class="max-w-md rounded overflow-hidden video-item" v-for="video in videos">
            <RouterLink :to="{ name: 'video', params: {id: video.id} }">
                <div class="thumbnail-preview">
                    <img class="w-full object-cover overflow-hidden" :src="video.thumbnail">
                </div>
                <div class="px-6 py-4">
                    <div class="font-bold text-base mb-2">{{ video.name }}</div>
                </div>
            </RouterLink>
        </div>  
    </div>
</template>

<style scoped>
.thumbnail-preview {
  width: 320px;
  height: 180px;
  overflow: hidden;
}

.thumbnail-preview img {
  width: 100%;
  height: auto;
}

.video-container {
    display: flex;
    flex-wrap: wrap;
}

@media (min-width: 700px) {
    
    .video-item {
        width: 50%;
        box-sizing: border-box;
    }
}

@media (min-width: 1300px) {    
    .video-item {
        width: 30%;
        box-sizing: border-box;
    }
}

@media (min-width: 1600px) { 
    .video-item {
        width: 25%;
        box-sizing: border-box;
    }
}

</style>