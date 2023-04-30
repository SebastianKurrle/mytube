import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
import type { MyTubeAccount, MyTubeAccountUpdate } from "@/assets/interfaces";
import router from "@/router";
import axios from "axios";

// handles the mytube account functions
export const useMyTubeAccountStore = defineStore('mytubeAccount', () => {
    const createErrors = reactive(Array())
    const updateErrors = reactive(Array())
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
        let mytubeAccount = null

        await axios
            .get(`/api/mytube-account/settings/${name}/`)
            .then(response => {
               mytubeAccount = response.data
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    toast.error('404 Not Found')
                } else {
                    toast.error('Access Forbidden')
                }

                router.push('/')
            })
        
        return mytubeAccount
    }

    // updates a MyTube Account
    const updateMyTubeAccount = async (updatedMyTubeAccount:MyTubeAccountUpdate, originalName:string) => {
        updateErrors.length = 0

        await axios
            .put(`/api/mytube-account/settings/${originalName}/`, updatedMyTubeAccount, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                toast.success(`${updatedMyTubeAccount.name} updated`, { autoClose: 3000 })
            })
            .catch(error => {
                if (error.response) {
                    // Loops the server errors and push it in the errors array
                    for (const property in error.response.data) {
                        updateErrors.push(
                            `${property}: ${error.response.data[property]}`
                        );
                    }
                }
            })
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

    // deletes the profile picture from a MyTube Account
    const deleteMyTubeAccountProfPic = async (name:string) => {
        axios
            .delete(`/api/mytube-account/settings/${name}/`)
            .then(response => {
                toast.warning('Profile picture deleted', { autoClose: 3000 })
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    return { 
        createErrors,
        updateErrors,
        selectedAccount, 
        userMyTubeAccounts, 
        createMyTubeAccount, 
        getMyTubeAccounts, 
        getMyTubeAccountSettingByName, 
        updateMyTubeAccount,
        deleteMyTubeAccount,
        deleteMyTubeAccountProfPic
    }
})
