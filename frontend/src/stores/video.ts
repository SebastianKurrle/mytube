import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import type { Video, VideoCALL } from "@/assets/interfaces";
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

        let data = createDataForUpload(video, chunk)

        axios
            .post('/api/video/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                calculateUpload()
                updateProgress()
                checkUploadStatus(file, video)
            })
            .catch(error => {
                toast.error('Error on upload', { autoClose: 3000 })
            })
    }

    const createDataForUpload = (video:Video, chunk:any) => {
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

        return data
    }

    const calculateUpload = () => {
        offset += chunkSize.value;
        uploadedChunks++;
        remainingChunks.value--;
    }

    const checkUploadStatus = (file:any, video:Video) => {
        if (offset < file.size) {
            uploadVideo(video)
        } else {
            toast.success('Upload successfully', { autoClose: 3000 })
            offset = 0
            uploadedChunks = 0
            remainingChunks.value = 0
            totalChunks.value = 0
        }
    }

    // gets a video from the api by id
    const  getVideoByID = async (id:string) => {
        let video:VideoCALL = {
            id: '',
            name: '',
            video: '',
            description: '',
            thumbnail: '',
            mt_account: '',
            url: ''
        }

        await axios
            .get(`/api/video/${id}/`)
            .then(response => {
                const data = response.data

                video.id = data.id
                video.name = data.name
                video.video = data.get_video
                video.description = data.description
                video.thumbnail = data.get_thumbnail
                video.mt_account = data.mt_account
                video.url = data.get_absolute_url
            })
            .catch(error => {
                if (error.response.status == 404) {
                    toast.error('Video not found 404', { autoClose: 3000 })
                } else {
                    toast.error('Error on load', { autoClose: 3000 })
                }
            })
        
        return video
    }

    // gets all videos from an MyTube account
    const getVideosFromMtAccount = async (mtAccountId:string) => {
        let videos = Array<VideoCALL>()

        await axios
            .get(`/api/video/mtaccount/${mtAccountId}/`)
            .then(response => {
                const data = response.data
                videos = dataEvaluation(data)
            })
            .catch(error => {
                toast.error('Something went wrong!', { autoClose: 3000 })
            })
        
        return videos
    }

    // loops over an array and evaluate it into VideoCALL objects
    const dataEvaluation = (data:Array<any>) => {
        let videos = Array<VideoCALL>()

        data.map(d => {
            const video:VideoCALL = {
                id: d.id,
                name: d.name,
                video: d.get_video,
                description: d.description,
                thumbnail: d.get_thumbnail,
                mt_account: d.mt_account,
                url: d.get_absolute_url
            }

            videos.push(video)
        })

        return videos
    }

    // updates the progress for the progress bar when a chunk is uploaded
    const updateProgress = () => {
        currentProgress.value = (uploadedChunks / totalChunks.value) * 100
    }

    return { 
        uploadErrors, 
        uploadVideo,
        getVideoByID,
        getVideosFromMtAccount,
        updateProgress, 
        remainingChunks, 
        chunkSize, 
        totalChunks,
        currentProgress
    }
})
