<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMyTubeAccountStore } from '@/stores/mytubeAccount';
import axios from 'axios';

// components
import CreateMyTubeAccount from '@/components/MyTubeAccount/CreateMyTubeAccount.vue';
import ListMyTubeAccounts from '@/components/MyTubeAccount/ListMyTubeAccounts.vue';

// stores
const myTubeAccountStore = useMyTubeAccountStore()


onMounted(() => {
    myTubeAccountStore.getMyTubeAccounts()
})

</script>

<template>
   <div class="p-3">
        <h4 class="text-3xl text-center text-white">MyTube Accounts</h4>

        <div class="border rounded-md mt-3 p-3 text-white mb-3">
            <h5 class="text-xl text-center text-neutral-400">What is a MyTube Account?</h5>

            <p class="text-center mt-3">
                A MyTube Account allows you to upload videos and creating a big community
            </p>
        </div>

        <div>
            <h5 class="text-xl text-neutral-400 mb-3">Getting Started</h5>
            <button
            type="button"
            class="bg-blue-700 p-3 rounded-md text-white hover:bg-blue-800"
            data-te-toggle="modal"
            data-te-target="#createMyTubeAccount"
            data-te-ripple-init
            data-te-ripple-color="light">
            <font-awesome-icon icon="fa-solid fa-plus" /> Create MyTube Account
            </button>
            <CreateMyTubeAccount />

            <h5 class="text-xl text-neutral-400 mt-3">Your MyTube Accounts</h5>

            <ListMyTubeAccounts v-for="account in myTubeAccountStore.userMyTubeAccounts" :key="account.id" :account="account"/>
        </div>
   </div>
</template>

<style>
    @import url('@/assets/style/forms.css');
</style>