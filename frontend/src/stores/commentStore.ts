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

    return {
        postComment
    }
})
