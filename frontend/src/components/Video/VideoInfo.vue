<script setup lang="ts">
    import { ref } from 'vue';

    // components
    import MtAccountBox from '../MyTubeAccount/MtAccountBox.vue';

    const props = defineProps(['video'])

    const video = ref(props.video)
</script>

<template>
    <div class="text-white">
        <div class="mt-3">
            <h5 class="text-xl font-semibold">{{ video.name }}</h5>
            <MtAccountBox :mtaccountID="video.mt_account"/>
        </div>

        <div class="bg-infobox p-3 rounded-md mt-3">
            {{ video.description }}
        </div>
    </div>
</template>

<style scoped>
.bg-infobox {
    background-color: #3F3F3F;
}
</style>