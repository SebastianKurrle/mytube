<script setup lang="ts">
    import { ref } from 'vue';
    import { useVideoStore } from '@/stores/video';
    import type { Video } from '@/assets/interfaces';

    // stores
    const videoStore = useVideoStore()

    const props = defineProps(['mtaccount'])

    const mtaccount = ref(props.mtaccount)

    // input vars
    const name = ref('')
    const videoFile = ref()
    const description = ref('')
    const thumbnailFile = ref({})

    const selectVideoFile = (event:any) => {
        videoFile.value = event.target.files[0] || {}
    }

    const selectThumbnailFile = (event:any) => {
        thumbnailFile.value = event.target.files[0] || {}
    }

    // uploads a video
    const uploadVideo = () => {
        const video:Video = {
            name: name.value,
            video: videoFile.value,
            description: description.value,
            thumbnail: thumbnailFile.value,
            mt_account: mtaccount.value.id
        }

        videoStore.remainingChunks = Math.ceil(videoFile.value.size / videoStore.chunkSize)
        videoStore.uploadVideo(video)

        name.value = ''
        description.value = ''
    }
</script>

<template>
    <div>
        <div class="flex justify-center mt-3 mb-3">
            <form class="form" @submit.prevent="uploadVideo">
                <span class="title">Upload Video</span>
                <label for="name" class="label">Title*</label>
                <input type="text" id="name" required class="input" v-model="name">

                <label for="desc" class="label">Description</label>
                <textarea id="desc" cols="30" rows="10" class="input" v-model="description"></textarea>

                <label for="video" class="label">Video file*</label>
                <input type="file" required id="video" class="input" accept="video/*, .mkv" @change="selectVideoFile">

                <label for="thumbnail" class="label">Thumbnail*</label>
                <input type="file" required id="thumbnail" class="input" accept="image/*" @change="selectThumbnailFile">

                <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="videoStore.uploadErrors.length">
                    <p v-for="error in videoStore.uploadErrors">{{ error }}</p>
                </div>

                <button type="submit" class="bg-green-700 rounded-md p-3 text-white hover:bg-green-800">
                    Upload</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('@/assets/style/forms.css');
</style>