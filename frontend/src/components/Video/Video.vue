<script setup lang="ts">
    import { ref } from 'vue';
    
    const props = defineProps(['url'])

    const url = props.url
</script>

<template>
  <video class="w-full" controls>
    <source :src="url" type="video/mp4" />
  </video>
</template>

<style scoped>
</style>