<script setup lang="ts">
    import { ref } from 'vue';

    // components
    import MtAccountBox from './MtAccountBox.vue';

    const props = defineProps(['video'])

    const video = ref(props.video)
    console.log(video.value)
</script>

<template>
    <div class="bg-neutral-900 p-3 rounded-md mt-3 text-white">
        <h5 class="text-xl font-semibold">{{ video.name }}</h5>
        <MtAccountBox :mtaccountID="video.mt_account"/>
    </div>
</template>

<style scoped>
</style>