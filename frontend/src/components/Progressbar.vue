<script setup lang="ts">
    import { useVideoStore } from '@/stores/video';

    // stores
    const videoStore = useVideoStore()
</script>

<template>
    <div class="progress-bar mb-3" v-if="videoStore.currentProgress > 0">
        <div class="progress" :style="{ width: videoStore.currentProgress + '%' }">
            <span class="text-white font-semibold p-3 text-center">
                {{ Math.floor(videoStore.currentProgress) }} %
            </span>
        </div>
    </div>
</template>

<style scoped>
.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  
.progress {
    height: 100%;
    background-color: #42b983;
    border-radius: 5px;
}
</style>