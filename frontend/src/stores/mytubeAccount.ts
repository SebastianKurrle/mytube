import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { toast } from "vue3-toastify";
import type { MyTubeAccount } from "@/assets/interfaces";
import axios from "axios";

// handles the mytube account functions
export const useMyTubeAccountStore = defineStore('mytubeAccount', () => {
    const createErrors = reactive(Array())

    const createMyTubeAccount = async (mytubeAccount:MyTubeAccount) => {
        createErrors.length = 0

        axios
            .post('/api/mytube-account/', mytubeAccount, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log(response)
                toast.success('MyTube Account created', { autoClose: 3000 })
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

    return { createErrors, createMyTubeAccount }
})
