<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useVideoStore } from '@/stores/video';
    import { useRoute } from 'vue-router';

    // components
    import Video from '@/components/Video.vue';

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
    <div v-if="loaded">
        <Video :url="video.video"/>
    </div>
</template>

<style scoped>
</style>