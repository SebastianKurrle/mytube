<script setup lang="ts">
    import { ref, onMounted  } from 'vue';
    import { useRoute, onBeforeRouteUpdate } from 'vue-router';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';
    import type { MyTubeAccountUpdate } from '@/assets/interfaces';
    import router from "@/router";

    // components
    import UploadVideo from '@/components/UploadVideo.vue';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const route = useRoute()

    // checks if the request is finished to the api
    const loaded = ref(false)

    const mytubeAccount = ref()

    const name = ref()
    const description = ref()
    const profilePicture = ref({})

    const getMyTubeAccount = async (accName:string) => {
        mytubeAccount.value = await myTubeAccountStore.getMyTubeAccountSettingByName(accName)

        name.value = mytubeAccount.value.name
        description.value = mytubeAccount.value.description

        loaded.value = true
    }

    // sets the value for the profilePicture reference
    const selectFile = (event:any) => {
        profilePicture.value = event.target.files[0] || {}
    }

    const submitUpdateAccount = async () => {
        const data:MyTubeAccountUpdate = {
            name: name.value,
            description: description.value,
            profile_picture: profilePicture.value,
        }

        loaded.value = false
        myTubeAccountStore.updateMyTubeAccount(data, mytubeAccount.value.name)
        .then(() => {
            // replace the old name with the new name in the url
            router.replace({ name: 'mytube-account-settings', params: { name: name.value } })
            getMyTubeAccount(name.value)
        })
    }

    const deleteProfPic = () => {
        myTubeAccountStore.deleteMyTubeAccountProfPic(mytubeAccount.value.name)
    }

    // gets the updated mytube accounts from the api
    onBeforeRouteUpdate(() => {
        myTubeAccountStore.getMyTubeAccounts()
    })

    onMounted(() => {
        getMyTubeAccount(String(route.params.name))
    })
</script>

<template>
    <div v-if="loaded">
        <h5 class="text-3xl text-center text-white">{{ mytubeAccount.name }} Settings</h5>

        <div class="flex justify-center mt-3 mb-3">
            <form class="form" @submit.prevent="submitUpdateAccount">
                <span class="title">Settings</span>
                <label for="name" class="label">Name</label>
                <input type="text" id="name" required class="input" v-model="name">

                <label for="desc" class="label">Description</label>
                <textarea id="desc" cols="30" rows="10" required class="input" v-model="description"></textarea>

                <label for="profPic" class="label">Profile Picture</label>
                <input type="file" id="profPic" @change="selectFile" class="input" accept="image/png, image/gif, image/jpeg">

                <button type="button"
                @click="deleteProfPic"
                class="bg-red-700 p-3 rounded-md text-white hover:bg-red-800 mb-3">
                <font-awesome-icon icon="fa-solid fa-trash" /> Profile Picture</button>

                <div class="bg-red-800 p-3 rounded-md mb-3 text-white" v-if="myTubeAccountStore.updateErrors.length">
                    <p v-for="error in myTubeAccountStore.updateErrors">{{ error }}</p>
                </div>

                <button type="submit" class="bg-green-700 rounded-md p-3 text-white hover:bg-green-800">
                    Update</button>
            </form>
        </div>

        <UploadVideo :mtaccount="mytubeAccount"/>
    </div>
</template>

<style scoped>
@import url('@/assets/style/forms.css');
</style>