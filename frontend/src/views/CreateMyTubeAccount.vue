<script setup lang="ts">
</script>

<template>
    <div class="flex justify-center mt-3">
        <form class="form" @submit.prevent="">
            <span class="title">Create MyTube Account</span>
            <label for="name" class="label">Name</label>
            <input type="text" id="name" required class="input">

            <label for="desc" class="label">Description</label>
            <textarea id="desc" cols="30" rows="10" class="input" required></textarea>

            <button type="submit" class="submit">Login</button>
        </form>
    </div>
</template>

<style>
    @import url('@/assets/style/forms.css');
</style>