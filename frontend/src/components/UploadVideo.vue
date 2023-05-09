<script setup lang="ts">
</script>

<template>
    <div>
        <div class="flex justify-center mt-3 mb-3">
            <form class="form" @submit.prevent="">
                <span class="title">Upload Video</span>
                <label for="name" class="label">Title</label>
                <input type="text" id="name" required class="input">

                <label for="desc" class="label">Description</label>
                <textarea id="desc" cols="30" rows="10" required class="input"></textarea>

                <label for="profPic" class="label">Video file</label>
                <input type="file" id="profPic" class="input">

                <div class="bg-red-800 p-3 rounded-md mb-3 text-white">
                    <p></p>
                </div>

                <button type="submit" class="bg-green-700 rounded-md p-3 text-white hover:bg-green-800">
                    Upload</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('@/assets/style/forms.css');
</style>