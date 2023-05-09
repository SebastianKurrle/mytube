import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import type { Video } from "@/assets/interfaces";
import axios from "axios";

// handles all video funktions
export const useVideoStore = defineStore('video', () => {
    const uploadErrors = reactive(Array())

    const uploadVideo = (video:Video) => {
        uploadErrors.length = 0

        axios
            .post('/api/video/', video, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                toast.success('Video uploaded', { autoClose: 3000 })
            })
            .catch(error => {
                if (error.response) {
                    // Loops the server errors and push it in the errors array
                    for (const property in error.response.data) {
                        uploadErrors.push(
                            `${property}: ${error.response.data[property]}`
                        );
                    }
                }
            })
    }

    return { uploadErrors, uploadVideo }
})
