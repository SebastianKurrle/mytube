<script setup lang="ts">
    import { useAuthenticatedStore } from '@/stores/authenticated';
    
    // components
    import UserInfo from '@/components/User/UserInfo.vue'

    const authenticatedStore = useAuthenticatedStore()
</script>

<template>
    <div class="p-3">
        <h5 class="text-3xl text-white text-center">Your Account</h5>

        <div>
            <UserInfo />

            <button class="bg-red-800 p-3 rounded-md text-white w-full hover:bg-red-900" @click="authenticatedStore.userLogout">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" 
                /> 
                Logout</button>
        </div>
    </div>
</template>

<style scoped>
</style>