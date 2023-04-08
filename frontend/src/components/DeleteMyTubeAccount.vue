<script setup lang="ts">
    import { ref, reactive } from 'vue';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const name = ref('')
    const valError = reactive(Array())

    const closeModal = ref() 

    const validate = ():boolean => {
        valError.length = 0

        if (name.value.trim() != myTubeAccountStore.selectedAccount.name) {
            valError.push('The names are not matching!')
            return false
        }
        
        return true
    }

    const deleteMyTubeAccount = () => {
        // checks if the names are matching
        if (validate()) {
            myTubeAccountStore.deleteMyTubeAccount()

            closeModal.value.click()
        }

        name.value = ''
    }
</script>

<template>
    <!-- Button trigger modal -->

    <!-- Modal -->
    <div
    data-te-modal-init
    class="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
    id="deleteMyTubeAccount"
    data-te-backdrop="static"
    data-te-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true">
    <div
        data-te-modal-dialog-ref
        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
        <div
        class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
        <div
            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            <h5
            class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
            id="exampleModalLabel">
            Delete MyTube Account
            </h5>
            <button
            type="button"
            class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            data-te-modal-dismiss
            aria-label="Close">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6">
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        <div data-te-modal-body-ref class="relative p-4" v-if="myTubeAccountStore.selectedAccount !== undefined">
            <div class="flex justify-center mt-3">
                <form class="form" @submit.prevent="deleteMyTubeAccount">
                    <span class="title text-red-700">Delete {{ myTubeAccountStore.selectedAccount.name }}</span>
                    <span class="mb-3 font-semibold">Enter the name of the MyTube Account to delete</span>
                    <label for="name" class="label">MyTube Accountname</label>
                    <input type="text" id="name" required class="input" v-model="name">
                    
                    <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="valError.length">
                        <p v-for="error in valError">{{ error }}</p>
                    </div>

                    <button type="submit" class="bg-red-700 rounded-md p-3 text-white hover:bg-red-800">
                        Confrime Delete <font-awesome-icon icon="fa-solid fa-triangle-exclamation" /></button>
                </form>
            </div>
        </div>
        <div
            class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            <button
            type="button"
            class="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
            data-te-modal-dismiss
            data-te-ripple-init
            data-te-ripple-color="light"
            ref="closeModal"
            >
            Close
            </button>
        </div>
        </div>
    </div>
    </div>
</template>

<style scoped>
</style>