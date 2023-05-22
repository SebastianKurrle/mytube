<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useAuthenticatedStore } from '@/stores/authenticated';
    import { useVideoStore } from '@/stores/video';
    import { useEvaluateStore } from '@/stores/evaluateStore';

    const props = defineProps(['video'])

    // stores
    const authenticatedStore = useAuthenticatedStore()
    const videoStore = useVideoStore()
    const evaluateStore = useEvaluateStore()

    const video = ref(props.video)

    const userEvaluateStatus = ref()
    const videoEvaluate = ref({
        likes: 0,
        dislikes: 0
    })


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

    const likeVideo = async () => {
        await evaluateStore.likeVideo(String(video.value.id), userEvaluateStatus.value)
        userEvaluateStatus.value = await evaluateStore.checkUserVideoEvaluation(String(video.value.id))

        await evaluationCount()
    }

    const dislikeVideo = async () => {
        await evaluateStore.dislikeVideo(String(video.value.id), userEvaluateStatus.value)
        userEvaluateStatus.value = await evaluateStore.checkUserVideoEvaluation(String(video.value.id))

        await evaluationCount()
    }

    const evaluationCount = async () => {
        const result = await evaluateStore.getVideoEvaluationCount(video.value.id)

        videoEvaluate.value.likes = result.likes
        videoEvaluate.value.dislikes = result.dislikes
    }

    const loaded = ref(false)

    onMounted(async () => {
        if (authenticatedStore.authenticated) {
            userEvaluateStatus.value = await evaluateStore.checkUserVideoEvaluation(String(video.value.id))
        }

        await evaluationCount()
        loaded.value = true
    })
</script>

<template>
    <div v-if="loaded" class="mt-3">
        <div class="p-3 rounded-3xl button-bg w-32 layout-buttons md:w-40">
            <div>
                <button @click="likeVideo"><font-awesome-icon :icon="likeIcon" class="text-2xl mr-3"/></button> <span>{{ videoEvaluate.likes }}</span>
            </div>
            <div>
                <button @click="dislikeVideo"><font-awesome-icon :icon="dislikeIcon" class="text-2xl"/></button> <span>{{ videoEvaluate.dislikes }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .button-bg {
        background-color: #3F3F3F;
    }

    .layout-buttons {
        display: flex;
        justify-content: space-between;
    }
</style>
