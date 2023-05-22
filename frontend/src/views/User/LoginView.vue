<script setup lang="ts">
    import { ref } from 'vue';
    import { useAuthenticatedStore } from '@/stores/authenticated';  
    import type { UserLogin } from '@/assets/interfaces';

    // stores
    const authenticatedStore = useAuthenticatedStore()

    const email = ref('')
    const password = ref('')

    const submitLogin = () => {
        const userData:UserLogin = {
            email: email.value,
            password: password.value
        }

        authenticatedStore.userLogin(userData)

        email.value = ''
        password.value = ''
    }
</script>

<template>
    <div class="p-3">
        <div class="flex justify-center mt-3">
            <form class="form" @submit.prevent="submitLogin">
                <span class="title">Login</span>
                <label for="email" class="label">Email</label>
                <input type="email" id="email" required class="input" v-model="email">

                <label for="password" class="label">Password</label>
                <input type="password" id="password" required class="input" v-model="password">
                
                <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="authenticatedStore.loginErrors.length">
                    <p v-for="error in authenticatedStore.loginErrors">{{ error }}</p>
                </div>

                <button type="submit" class="submit">Login</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('@/assets/style/forms.css');
</style>