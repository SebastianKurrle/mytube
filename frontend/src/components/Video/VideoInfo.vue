<script setup lang="ts">
    import { ref } from 'vue';
    import moment from "moment";

    // components
    import MtAccountBox from '../MyTubeAccount/MtAccountBox.vue';
    import EvaluateVideo from './EvaluateVideo.vue';

    const props = defineProps(['video'])

    const video = ref(props.video)

    const getTimeAgoFromVideo = (datetimeString:string) => {
      const datetime = moment(datetimeString);
      return datetime.fromNow();
    }

</script>

<template>
    <div class="text-white p-3">
        <div class="mt-3">
            <h5 class="text-xl font-semibold">{{ video.name }}</h5>
            <div class="video-info">
                <MtAccountBox :mtaccountID="video.mt_account"/>
                <EvaluateVideo :video="video"/>
            </div>
        </div>

        <div class="bg-infobox p-3 rounded-md mt-3">
            <p class="font-semibold">{{ video.calls }} Calls {{ getTimeAgoFromVideo(video.datetime_posted) }}</p>
            <p>{{ video.description }}</p>
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