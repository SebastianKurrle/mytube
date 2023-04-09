import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import router from "@/router";
import { toast } from "vue3-toastify";
import type { MyTubeAccount } from "@/assets/interfaces";
import axios from "axios";

// handles the mytube account functions
export const useMyTubeAccountStore = defineStore('mytubeAccount', () => {
    const createErrors = reactive(Array())
    const userMyTubeAccounts = reactive(Array())

    // Saves the selected account from the user to delete
    const selectedAccount = ref()

    const createMyTubeAccount = async (mytubeAccount:MyTubeAccount) => {
        createErrors.length = 0

        axios
            .post('/api/mytube-account/', mytubeAccount, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                toast.success('MyTube Account created', { autoClose: 3000 })
                getMyTubeAccounts()
            })
            .catch(error => {
                console.log(error)
                if (error.response) {
                    // Loops the server errors and push it in the errors array
                    for (const property in error.response.data) {
                        createErrors.push(
                            `${property}: ${error.response.data[property]}`
                        );
                    }
                }
            })
    }

    // gets all MyTube Accounts from an user
    const getMyTubeAccounts = async () => {

        await axios
            .get('/api/mytube-account/')
            .then(response => {
                userMyTubeAccounts.length = 0
                response.data.map((account:object) => {
                    userMyTubeAccounts.push(account)
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    // gets a MyTube Account for the settings page
    const getMyTubeAccountSettingByName = async (name:string) => {
        let mytubeAccount = {}

        await axios
            .get(`/api/mytube-account/settings/${name}/`)
            .then(response => {
               mytubeAccount = response.data
            })
            .catch(error => {
                toast.error('Access forbidden')
                router.push('/')
            })
        
        return mytubeAccount
    }

    // deletes an account by an id
    const deleteMyTubeAccount = async () => {
        axios
            .delete(`/api/mytube-account/${selectedAccount.value.id}/`)
            .then(response => {
                toast.error(`${selectedAccount.value.name} has been deleted!`)
                getMyTubeAccounts()
            })
            .catch(error => {
                toast.error('Something went wrong!')
            })
    }

    return { 
        createErrors, 
        selectedAccount, 
        userMyTubeAccounts, 
        createMyTubeAccount, 
        getMyTubeAccounts, 
        getMyTubeAccountSettingByName, 
        deleteMyTubeAccount 
    }
})
