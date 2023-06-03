import { defineStore } from "pinia";
import { ref } from 'vue'
import { toast } from "vue3-toastify";
import { useAuthenticatedStore } from "@/stores/authenticated";
import axios from "axios";

export const useSubscribeStore = defineStore('subscribe', () => {
    // stores
    const authenticatedStore = useAuthenticatedStore()


    /*
        This function checks if a user subscribed a MyTube account
        and returns the result
    */
    const checkUserSubscribed = async (mtAccountID:string):Promise<boolean> => {
        let subscribed:boolean = false

        await axios
            .get(`/api/mytube-account/subscribe/${mtAccountID}/`)
            .then(response => {
                subscribed = response.data.subscribed
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return subscribed
    }

    const subscribe = async (mtAccountID:string) => {
        const data = {
            mt_account: mtAccountID,
            user: authenticatedStore.user.id
        }

        await axios
            .post('/api/mytube-account/subscribe/', data)
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    const unsubscribe = async (mtAccountID:string) => {
        const data = {
            mt_account: mtAccountID,
            user: authenticatedStore.user.id
        }

        await axios
            .delete('/api/mytube-account/subscribe/', {
                data:data
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    return {
        checkUserSubscribed,
        subscribe,
        unsubscribe
    }
})
