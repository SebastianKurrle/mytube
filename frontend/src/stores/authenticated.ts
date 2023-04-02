import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { toast } from 'vue3-toastify' 
import type { User, UserLogin } from '@/assets/interfaces'
import axios from 'axios'
import { useCookies } from "vue3-cookies";
import router from "@/router";

const { cookies } = useCookies()

// handles the user functions
export const useAuthenticatedStore = defineStore('authenticated', () => {
    let authenticated = ref(false)
    let signUpErrors = reactive(Array())
    let loginErrors = reactive(Array())

    const user = ref()
    const loaded = ref(false)

    const setAuthenticated = (auth:boolean) => {
        authenticated.value = auth
    }

    // checks if a token is valid
    // login param: When the function ist called for login than the router will push to /account
    // authenticated param: Is for the setAuthentitcated function
    const checkToken = async (token:string, login:boolean, authenticated:boolean) => {
        if (token) {
            await axios
                .get('/api/users/user/', {
                    headers: {
                        // test header with the unvalidated token
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

                    user.value = response.data
                    setAuthenticated(authenticated)
                })
                .catch(error => {
                    toast.error('Authentication Error', { autoClose: 3000 })
                    cookies.remove('jwt')
                })
        } else {
            axios.defaults.headers.common['Authorization'] = ''
        }

        loaded.value = true

        if (login) {
            router.push('/account')
        }
    }

    const userSignUp = async (user:User) => {
        signUpErrors.length = 0

        await axios
            .post('/api/users/register/', user)
            .then(response => {
                router.push({ name: 'login' })
                toast.success(`${user.name} signed up successfully`, { autoClose: 3000 })
            })
            .catch(error => {
                if (error.response) {
                    // Loops the server errors and push it in the errors array
                    for (const property in error.response.data) {
                        signUpErrors.push(
                            `${property}: ${error.response.data[property]}`
                        );
                    }
                }
            })
    }

    const userLogin = async (user:UserLogin) => {
        loginErrors.length = 0

        await axios
            .post('/api/users/login/', user)
            .then(response => {
                cookies.set('jwt', response.data.jwt)
                checkToken(cookies.get('jwt'), true, true)
            })
            .catch(error => {
                if (error.response) {
                    // Loops the server errors and push it in the errors array
                    for (const property in error.response.data) {
                        loginErrors.push(
                            `${property}: ${error.response.data[property]}`
                        );
                    }
                }
            })
    }

    const userLogout = async () => {
        axios
            .post('/api/users/logout/')
            .then(response => {
                setAuthenticated(false)
                cookies.remove('jwt')
                axios.defaults.headers.common['Authorization'] = ''

                router.push('/login')
            })
            .catch(error => {
                toast.error('Logout error', { autoClose: 3000 })
            })
    }

    return { authenticated, setAuthenticated, checkToken, userSignUp, userLogin, userLogout, signUpErrors, loginErrors, user, loaded }
})
