<script setup lang="ts">
  import { ref } from 'vue'

  // components
  import CommentPostInput from "@/components/Video/comments/CommentPostInput.vue";

  const props = defineProps(['video'])

  const video = ref(props.video)
</script>

<template>
  <div>
    <CommentPostInput :video="video"/>
  </div>
</template>

<style scoped>

</style>