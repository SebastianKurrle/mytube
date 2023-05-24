<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useVideoStore } from '@/stores/video';
    import { useRoute } from 'vue-router';

    // components
    import Video from '@/components/Video/Video.vue';
    import VideoInfo from '@/components/Video/VideoInfo.vue';
    import Comments from "@/components/Video/comments/Comments.vue";

    const route = useRoute()

    // stores
    const videoStore = useVideoStore()

    const loaded = ref(false)

    const video = ref()

    onMounted(async () => {
        const id = String(route.params.id)
        
        video.value = await videoStore.getVideoByID(id)
        loaded.value = true
    })
</script>

<template>
    <div v-if="loaded" class="mt-3">
        <div class="flex justify-center h-screen">
            <div class="max-w-screen-lg">
                <Video :url="video.video"/>
                <VideoInfo :video="video"/>
                <Comments :video="video"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>