<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthenticatedStore } from '@/stores/authenticated';  
import type { User } from '@/assets/interfaces';

// stores
const authenticatedStore = useAuthenticatedStore()

// form vars
const email = ref('')
const name = ref('')
const password = ref('')
const password2 = ref('')

const submitSignUp = () => {
    authenticatedStore.signUpErrors.length = 0

    if (password.value !== password2.value) {
        return authenticatedStore.signUpErrors.push({password: 'The passwords are not matching'})
    }

    const userData:User = {
        email: email.value,
        name: name.value,
        password: password.value
    }

    // response catches the errors
    authenticatedStore.userSignUp(userData)

    email.value = ''
    name.value = ''
    password.value = ''
    password2.value = ''
}
</script>

<template>
    <div>
        <div class="flex justify-center mt-3">
            <form class="form" @submit.prevent="submitSignUp">
                <span class="title">Sign Up</span>
                <label for="email" class="label">Email</label>
                <input type="email" id="email" required class="input" v-model="email">

                <label for="name" class="label">Name</label>
                <input type="text" id="name" required class="input" v-model="name">

                <label for="password" class="label">Password</label>
                <input type="password" id="password" required class="input" v-model="password">
                
                <label for="password2" class="label">Password Again</label>
                <input type="password" id="password2" required class="input" v-model="password2">
                
                <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="authenticatedStore.signUpErrors.length">
                    <p v-for="error in authenticatedStore.signUpErrors">{{ error }}</p>
                </div>

                <button type="submit" class="submit">Register</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
    @import url('@/assets/style/forms.css');
</style>