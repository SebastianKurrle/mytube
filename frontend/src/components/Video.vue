<script setup lang="ts">
    import { ref } from 'vue';
    
    const props = defineProps(['url'])

    const url = props.url
</script>

<template>
    <div class="flex justify-center h-screen">
        <div class="max-w-screen-lg">
          <video class="w-full" controls>
            <source :src="url" type="video/mp4" />
          </video>
        </div>
    </div>
</template>

<style scoped>
</style>