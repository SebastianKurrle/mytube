<script setup lang="ts">
// components
import CreateMyTubeAccount from '@/components/CreateMyTubeAccount.vue';
</script>

<template>
   <div>
        <h4 class="text-3xl text-center text-white">MyTube Accounts</h4>

        <div class="border rounded-md mt-3 p-3 text-white mb-3">
            <h5 class="text-xl text-center text-neutral-400">What is a MyTube Account?</h5>

            <p class="text-center mt-3">
                A MyTube Account allows you to upload videos and creating a big community
            </p>
        </div>

        <div>
            <h5 class="text-xl text-neutral-400 mb-3">Getting Started</h5>

            <CreateMyTubeAccount />
        </div>
   </div>
</template>

<style>
    @import url('@/assets/style/forms.css');
</style>