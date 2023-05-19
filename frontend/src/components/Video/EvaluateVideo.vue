<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useAuthenticatedStore } from '@/stores/authenticated';
    import { useVideoStore } from '@/stores/video';

    const props = defineProps(['video'])

    // stores
    const authenticatedStore = useAuthenticatedStore()
    const videoStore = useVideoStore()

    const video = ref(props.video)

    const userEvaluateStatus = ref()
    
    const likeIcon = computed(() => {
        if (userEvaluateStatus.value === '0') {
            return ['fas', 'thumbs-up']; // fa-solid thumbs-up icon
        } else {
            return ['far', 'thumbs-up']; // fa-regular thumbs-up icon
        }
    });

    const dislikeIcon = computed(() => {
        if (userEvaluateStatus.value === '1') {
            return ['fas', 'thumbs-down']; // fa-solid thumbs-down icon
        } else {
            return ['far', 'thumbs-down']; // fa-regular thumbs-down icon
        }
    });

    onMounted(async () => {
        if (authenticatedStore.authenticated) {
            userEvaluateStatus.value = await videoStore.checkUserVideoEvaluation(String(video.value.id))
        }
    })
</script>

<template>
    <div>
        <button><font-awesome-icon :icon="likeIcon" class="text-2xl mr-3"/></button>
        <button><font-awesome-icon :icon="dislikeIcon" class="text-2xl"/></button>
    </div>
</template>

<style scoped>
</style>
