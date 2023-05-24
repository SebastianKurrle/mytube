import { defineStore } from "pinia";
import { ref } from 'vue'
import { toast } from "vue3-toastify";
import type { Comment } from "@/assets/interfaces";
import axios from "axios";
import {comment} from "postcss";

export const useCommentStore = defineStore('comment', () => {

    /*
        This function posts a comment for a video
        comment parameter is from type Comment
        contains message, videoID, userID
    */
    const postComment = async (comment:Comment) => {
        axios
            .post('/api/video/comment/', comment)
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    const getLatestComments = async (datetime:string, currentLoadedComments:Array<object>, videoID:string):Promise<Array<object>> => {
        const newComments = currentLoadedComments

        await axios
            .get(`/api/video/${videoID}/comments/?start_datetime=${datetime}`)
            .then(response => {
                const data = Array(response.data)

                data.map(comment => {
                    newComments.push(comment)
                })
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return newComments
    }

    return {
        postComment,
        getLatestComments
    }
})
