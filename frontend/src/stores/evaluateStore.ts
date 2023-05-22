import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import axios from "axios";


export const useEvaluateStore = defineStore('evaluate', () => {
    /* 
        This function checks if a user liked, disliked or not evaluated a video
        If the user liked a video it returns 0 and if the user disliked a video it returns 1
        otherwise it returns an empty string
    */
    const checkUserVideoEvaluation = async (videoID: string) => {
        let result = ''

        await axios
            .get(`/api/video/${videoID}/evaluate/`)
            .then(response => {
                result = response.data
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return result
    }

    /*
        The function gets a video id and makes a http get request to the api
        the api response with the count of likes and dislikes from the video
        The function returns the likes and dislikes in an object
    */
    const getVideoEvaluationCount = async (videoID:string) => {
        const result = {
            likes: 0,
            dislikes: 0
        }

        await axios
            .get(`/api/video/${videoID}/evaluate/count/`)
            .then(response => {
                const data = response.data
                result.likes = data.likes
                result.dislikes = data.dislikes
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
        
        return result
    }

    /* 
        This function gets a video id and a evaluation status from a user
        evaluateStatus '0' means the user have already liked the video
        evaluateStatus '1' means ths user have already disliked the video
        evaluateStatus '' means the user have not evaluate the video yet

        Function is called when a user clicked the like button
    */
    const likeVideo = async (videoID:string, evaluateStatus:string) => {
        switch (evaluateStatus) {
            case '0':
                await runEvaluation(videoID, 'r-like')
                break;
            case '1':
                await runEvaluation(videoID, 'r-dislike')
                await runEvaluation(videoID, 'like')
                break;
            case '':
                await runEvaluation(videoID, 'like')
                break;
        }
    }

    /* 
        This function gets a video id and a evaluation status from a user
        evaluateStatus '0' means the user have already liked the video
        evaluateStatus '1' means ths user have already disliked the video
        evaluateStatus '' means the user have not evaluate the video yet

        Function is called when a user clicked the dislike button
    */
    const dislikeVideo = async (videoID:string, evaluateStatus:string) => {
        switch (evaluateStatus) {
            case '0':
                await runEvaluation(videoID, 'r-like')
                await runEvaluation(videoID, 'dislike')
                break;
            case '1':
                await runEvaluation(videoID, 'r-dislike')
                break;
            case '':
                await runEvaluation(videoID, 'dislike')
                break;
        }
    }

    /*
        The function gets a video id and an evaluation type
        and makes a http post reqeust to the api

        Evaluation types:
        - like (to like a video)
        - r-like (to remove a like from a video)
        - dislike (to dislike a video)
        - r-dislike (to remove a dislike from a video)  
    */
    const runEvaluation = async (videoID:string, type:string) => {
        await axios
            .post(`/api/video/${videoID}/evaluate/?v=${type}`)
    }

    return {
        checkUserVideoEvaluation,
        getVideoEvaluationCount,
        likeVideo,
        dislikeVideo
    }
})
