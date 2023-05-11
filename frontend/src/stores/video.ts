import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import type { Video } from "@/assets/interfaces";
import axios from "axios";

// handles all video funktions
export const useVideoStore = defineStore('video', () => {
    const uploadErrors = reactive(Array())

    // vars for the video upload in chunks
    const chunkSize = ref(1024 * 1024);
    let offset = 0;
    let uploadedChunks = 0;
    const remainingChunks = ref(0);
    const totalChunks = ref(0)

    const currentProgress = ref(0)

    const uploadVideo = (video:Video) => {
        const file = video.video
        const chunk = file.slice(offset, offset + chunkSize.value)

        let data = {}

        if (remainingChunks.value > 1) {
            data = {
                chunk: chunk,
                remainingChunks: remainingChunks.value,
                uploadedChunks: uploadedChunks
            }
        } else {
            data = {
                chunk: chunk,
                remainingChunks: remainingChunks.value,
                uploadedChunks: uploadedChunks,
                
                // video settings
                name: video.name,
                description: video.description,
                thumbnail: video.thumbnail,
                mt_account: video.mt_account
            }
        }

        axios
            .post('/api/video/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                offset += chunkSize.value;
                uploadedChunks++;
                remainingChunks.value--;

                updateProgress()
                
                if (offset < file.size) {
                    uploadVideo(video)
                } else {
                    toast.success('Upload successfully', { autoClose: 3000 })
                    offset = 0
                    uploadedChunks = 0
                    remainingChunks.value = 0
                    totalChunks.value = 0
                }
            })
            .catch(error => {
                toast.error('Error on upload', { autoClose: 3000 })
            })
    }

    // updates the progress for the progress bar when a chunk is uploaded
    const updateProgress = () => {
        currentProgress.value = (uploadedChunks / totalChunks.value) * 100
    }

    return { 
        uploadErrors, 
        uploadVideo,
        updateProgress, 
        remainingChunks, 
        chunkSize, 
        totalChunks,
        currentProgress
    }
})
