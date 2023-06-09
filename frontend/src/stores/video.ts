import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import { useAuthenticatedStore } from "@/stores/authenticated";
import { useRoute } from "vue-router";
import type { Video, VideoCALL } from "@/assets/interfaces";
import axios from "axios";
import moment from "moment/moment";

// handles all video functions
export const useVideoStore = defineStore('video', () => {
    const route = useRoute()

    // stores
    const authenticatedStore = useAuthenticatedStore()

    const uploadErrors = reactive(Array())

    // vars for the video upload in chunks
    const chunkSize = ref(1024 * 1024);
    let offset = 0;
    let uploadedChunks = 0;
    const remainingChunks = ref(0);
    const totalChunks = ref(0)

    const currentProgress = ref(0)

    const searchQuery = ref('')
    const searchResult = reactive(Array<object>())

    /* 
        Upload Vidoes
    */

    // Uploads a video in chunks
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

    /*
    Creat the data for the upload
    When the last chunk is going to be uploaded the data will also include the video data
    to finish the upload
    */
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

    //Calculates the new offset and the chunk vars
    const calculateUpload = () => {
        offset += chunkSize.value;
        uploadedChunks++;
        remainingChunks.value--;
    }

    /*
    Checks the status of the current upload if the upload isn`t finished
    it will continue the upload otherwise it resets all uploads vars
    */
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

    /* 
        Get Videos
    */

    /*
        The function gets the suggested videos for the HomeView
        If the user is authenticated it will return the 10 latest videos from the subscribed MyTube accounts
        by the user.
        If the user is unauthenticated it will return the 10 latest and most popular videos
        If the user has 0 subscribed MyTube accounts it will also return the 10 latest and most popular videos
    */
    const getSuggestedVideos = async ():Promise<Array<object>> => {
        const suggestedVideos = Array<object>()
        await axios
            .get(`/api/video/suggest/?auth=${authenticatedStore.authenticated}`)
            .then(response => {
                const data:Array<object> = response.data.videos
                data.map(video => {
                    suggestedVideos.push(video)
                })
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return suggestedVideos
    }

    // gets a video from the api by id
    const getVideoByID = async (id:string) => {
        let video:any = {}

        await axios
            .get(`/api/video/${id}/`)
            .then(response => {
                const videoObject = response.data.video
                const extras = response.data.extras

                video.id = videoObject.id
                video.name = videoObject.name
                video.video = videoObject.get_video
                video.description = videoObject.description
                video.thumbnail = videoObject.get_thumbnail
                video.datetime_posted = videoObject.datetime_posted
                video.calls = videoObject.calls
                video.mt_account = videoObject.mt_account
                video.url = videoObject.get_absolute_url,
                video.commentsCount = extras.comments
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

    const searchVideos = async () => {

        const query = route.query.query

        await axios
            .get(`/api/video/search/?query=${query}`)
            .then(response => {
                const result:Array<object> = response.data.searchResult

                searchResult.length = 0

                result.map(video => {
                    searchResult.push(video)
                })
            })
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
                calls: d.calls,
                datetime_posted: d.datetime_posted,
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

    const getTimeAgoFromVideo = (datetimeString:string) => {
        const datetime = moment(datetimeString);
        return datetime.fromNow();
    }

    return { 
        uploadErrors, 
        uploadVideo,
        getSuggestedVideos,
        getVideoByID,
        getVideosFromMtAccount,
        searchVideos,
        updateProgress,
        getTimeAgoFromVideo,
        remainingChunks, 
        chunkSize, 
        totalChunks,
        currentProgress,
        searchQuery,
        searchResult
    }
})
