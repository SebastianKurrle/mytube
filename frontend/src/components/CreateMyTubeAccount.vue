<script setup lang="ts">
    import { ref } from 'vue';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';
    import { useAuthenticatedStore } from '@/stores/authenticated';
    import type { MyTubeAccount } from '@/assets/interfaces';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()
    const authenticatedStore = useAuthenticatedStore()

    const name = ref('')
    const desc = ref('')
    const profPic = ref({})

    const selectFile = (event:any) => {
        profPic.value = event.target.files[0] || {}
    }

    const submitCreateAccount = () => {
        const data:MyTubeAccount = {
            name:name.value,
            description: desc.value,
            profile_picture: profPic.value,
            owner: authenticatedStore.user.id
        }

        myTubeAccountStore.createMyTubeAccount(data)

        name.value = ''
        desc.value = ''
    }
</script>

<template>
    <div>
        <!-- Modal -->
        <div
        data-te-modal-init
        class="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="createMyTubeAccount"
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
                Create MyTube Account
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
            <div data-te-modal-body-ref class="relative p-4">
                <div class="flex justify-center mt-3">
                    <form class="form" @submit.prevent="submitCreateAccount">
                        <span class="title">Create</span>
                        <label for="name" class="label">Name</label>
                        <input type="text" id="name" required class="input" v-model="name">
        
                        <label for="desc" class="label">Description</label>
                        <textarea id="desc" cols="30" rows="10" required class="input" v-model="desc"></textarea>

                        <label for="profPic" class="label">Profile Picture</label>
                        <input type="file" id="profPic" class="input" @change="selectFile" accept="image/png, image/gif, image/jpeg">
                        
                        <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="myTubeAccountStore.createErrors.length">
                            <p v-for="error in myTubeAccountStore.createErrors">{{ error }}</p>
                        </div>

                        <button type="submit" class="bg-green-700 rounded-md p-3 text-white hover:bg-green-800">
                            Create</button>
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
                >
                Close
            </button>
            </div>
        </div>
        </div>
        </div>
    </div>
</template>

<style scoped>
</style>