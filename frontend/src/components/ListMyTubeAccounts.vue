<script setup lang="ts">
    import { ref } from 'vue';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount'

    // components
    import DeleteMyTubeAccount from './DeleteMyTubeAccount.vue';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const props = defineProps(['account'])

    const account = ref(props.account)

    // handles the click on a delete button to select an account
    const selectAccount = (account:object) => {
        myTubeAccountStore.selectedAccount = account
    }
</script>

<template>
    <div class="mt-3 text-center"   >
        <div
          class="block rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
          <h5
            class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {{ account.name }}
          </h5>
          <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {{ account.description }}
          </p>
          <button class="bg-blue-700 p-3 rounded-md text-white hover:bg-blue-800 mr-3">Go to Account</button>
          <button class="bg-red-700 p-3 rounded-md text-white hover:bg-red-800 w-32"
          data-te-toggle="modal"
          data-te-target="#deleteMyTubeAccount"
          data-te-ripple-init
          data-te-ripple-color="light"
          @click="() =>selectAccount(account)"
          ><font-awesome-icon icon="fa-solid fa-trash" /></button>
          <DeleteMyTubeAccount />
        </div>
    </div>
</template>

<style scoped>
</style>