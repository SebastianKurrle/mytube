<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const route = useRoute()

    // checks if the request is finished to the api
    const loaded = ref(false)

    const mytubeAccount = ref()

    const name = ref()
    const description = ref()
    const profilePicture = ref()

    const getMyTubeAccount = async () => {
        mytubeAccount.value = await myTubeAccountStore.getMyTubeAccountSettingByName(String(route.params.name))

        name.value = mytubeAccount.value.name
        description.value = mytubeAccount.value.description

        loaded.value = true
    }

    // sets the value for the profilePicture reference
    const selectFile = (event:any) => {
        profilePicture.value = event.target.files[0] || {}
    }

    onMounted(() => {
        getMyTubeAccount()
    })
</script>

<template>
    <div v-if="loaded">
        <h5 class="text-3xl text-center text-white">{{ mytubeAccount.name }} Settings</h5>

        <div class="flex justify-center mt-3">
            <form class="form">
                <span class="title">Settings</span>
                <label for="name" class="label">Name</label>
                <input type="text" id="name" required class="input" v-model="name">

                <label for="desc" class="label">Description</label>
                <textarea id="desc" cols="30" rows="10" required class="input" v-model="description"></textarea>

                <label for="profPic" class="label">Profile Picture</label>
                <input type="file" id="profPic" @change="selectFile" class="input" accept="image/png, image/gif, image/jpeg">

                <button type="button" class="bg-red-700 p-3 rounded-md text-white hover:bg-red-800 mb-3"><font-awesome-icon icon="fa-solid fa-trash" /> Profile Picture</button>

                <button type="submit" class="bg-green-700 rounded-md p-3 text-white hover:bg-green-800">
                    Update</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('@/assets/style/forms.css');
</style>