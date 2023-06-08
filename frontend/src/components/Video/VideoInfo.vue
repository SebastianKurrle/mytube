<script setup lang="ts">
    import { ref } from 'vue';
    import { useVideoStore } from "@/stores/video";

    // components
    import MtAccountBox from '../MyTubeAccount/MtAccountBox.vue';
    import EvaluateVideo from './EvaluateVideo.vue';

    // stores
    const videoStore = useVideoStore()

    const props = defineProps(['video'])

    const video = ref(props.video)

</script>

<template>
    <div class="text-white p-3">
        <div class="mt-3">
            <h5 class="text-lg md:text-xl font-semibold">{{ video.name }}</h5>
            <div class="video-info">
                <MtAccountBox :mtaccountID="video.mt_account.id"/>
                <EvaluateVideo :video="video"/>
            </div>
        </div>

        <div class="bg-infobox p-3 rounded-md mt-3">
            <p class="font-semibold text-sm md:text-lg">{{ video.calls }} Views {{ videoStore.getTimeAgoFromVideo(video.datetime_posted) }}</p>
            <p class="text-sm md:text-lg">{{ video.description }}</p>
        </div>
    </div>
</template>

<style scoped>
.bg-infobox {
    background-color: #3F3F3F;
}

@media (min-width: 700px) {
    .video-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>