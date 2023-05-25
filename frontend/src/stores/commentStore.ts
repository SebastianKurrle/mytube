import { defineStore } from "pinia";
import { ref } from 'vue'
import { toast } from "vue3-toastify";
import type { Comment } from "@/assets/interfaces";
import axios from "axios";

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

    /*
        This function gets the latest comments from a video based on the datetime
        If datetime = now it will return the 5 latest comments
        If datetime = 2023-05-25T14:07:52.671367Z for example it will return the 5 latest comments
        after this datetime
    */
    const getLatestComments = async (datetime:string, videoID:string)=> {
        const newComments = Array()

        //console.log(newComments)

        await axios
            .get(`/api/video/${videoID}/comments/?start_datetime=${datetime}`)
            .then(response => {
                const data:Array<any> = response.data
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
