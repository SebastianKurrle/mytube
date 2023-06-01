import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import type { Comment } from "@/assets/interfaces";
import axios from "axios";

export const useCommentStore = defineStore('comment', () => {

    // Contains all loaded comments from a video
    const comments = reactive(Array())

    // Contains a selected comment from a user to update or delete
    const selectedComment = ref()

    /*
        This function posts a comment for a video
        comment parameter is from type Comment
        contains message, videoID, userID
    */
    const postComment = async (comment:Comment) => {
        let postedComment:any;

        await axios
            .post('/api/video/comment/', comment)
            .then(response => {
                postedComment = response.data
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return postedComment
    }

    /*
        Updates the current selected comment
    */
    const updateComment = async () => {
        const data:object = {
            message: selectedComment.value.message
        }

        await axios
            .put(`/api/video/comment/${selectedComment.value.id}/`, data)
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    /*
        Deletes the current selected comment
    */
    const deleteComment = async () => {
        await axios
            .delete(`/api/video/comment/${selectedComment.value.id}/`)
            .then(response => {
                toast.error('Comment deleted', { autoClose: 3000 })
            })
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

        await axios
            .get(`/api/video/${videoID}/comments/?value=${datetime}&posted=false`)
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

    /*
        This function loads the 5 latest comments from a video and
        push them in the comments array
    */
    const loadComments = async (video:any) => {
        let result = Array()

        if (comments.length === 0) {
            result = await getLatestComments('now', video.value.id)
        } else {
            const lastComment:any = comments.slice(-1)[0]
            const dateTime = lastComment.datetime_posted
            result = await getLatestComments(dateTime, video.value.id)
        }

        result.map(comment => {
            comments.push(comment)
        })
    }

    /*
        This function is called if the user posts a comment
        The function gets the comment by id from the api and place the comment
        on the first position in the comments array
    */
    const getPostedComment = async (commentID:string, videoID:string) => {
        await axios
            .get(`/api/video/${videoID}/comments/?value=${commentID}&posted=true`)
            .then(response => {
                comments.unshift(response.data)
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    return {
        comments,
        selectedComment,
        postComment,
        updateComment,
        deleteComment,
        getLatestComments,
        loadComments,
        getPostedComment
    }
})
