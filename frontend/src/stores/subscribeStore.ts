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
            .get(`/api/mytube-account/subscribe/check/${mtAccountID}/`)
            .then(response => {
                subscribed = response.data.subscribed
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return subscribed
    }

    /*
        Function to subscribe a MyTube account
    */
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

    /*
        Function to unsubscribe a MyTube account
    */
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

    /*
        This function return the count of subscribers from a MyTube account
    */
    const countSubscribers = async (mtAccountID:string):Promise<string> => {
        let subCount:string = ''

        await axios
            .get(`/api/mytube-account/subscribe/${mtAccountID}/`)
            .then(response => {
                subCount = formatNumber(response.data.subCount)
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })

        return subCount
    }

    /*
        The function get an input number if the number is greater than one million
        It cuts the number and ats the suffix Mio otherwise it do nothing
        For example: 130000 => 1.30 Mio, 50 => 50
    */
    const formatNumber = (num:number):string => {
        if (num >= 1000000) {
            let shortNum = num / 1000000
            return `${shortNum.toFixed(2)} Mio`
        }

        return String(num)
    }

    return {
        checkUserSubscribed,
        subscribe,
        unsubscribe,
        countSubscribers
    }
})
