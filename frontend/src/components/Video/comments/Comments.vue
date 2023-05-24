<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from "vue-router";

  // components
  import CommentPostInput from "@/components/Video/comments/CommentPostInput.vue";

  const route = useRoute()

  const props = defineProps(['video'])

  const video = ref(props.video)

  const maxScrollPos = ref(window.scrollY)

  const updateMaxScrollPos = () => {
    if (maxScrollPos.value < window.scrollY) {
      maxScrollPos.value = window.scrollY
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', () => {
      if (route.name === 'video') {
        updateMaxScrollPos()
      }
    })
  })
</script>

<template>
  <div>
    <CommentPostInput :video="video"/>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
  </div>
</template>

<style scoped>

</style>