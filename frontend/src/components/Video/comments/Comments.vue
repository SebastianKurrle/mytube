<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useCommentStore } from "@/stores/commentStore";
  import { useRoute } from "vue-router";

  // components
  import CommentPostInput from "@/components/Video/comments/CommentPostInput.vue";
  import Comment from "@/components/Video/comments/Comment.vue";

  // stores
  const commentStore = useCommentStore()

  const route = useRoute()

  const props = defineProps(['video'])

  const video = ref(props.video)

  const maxScrollPos = ref(window.scrollY)

  const updateMaxScrollPos = () => {
    if (maxScrollPos.value < window.scrollY) {
      maxScrollPos.value = window.scrollY

      commentStore.loadComments(video)
    }
  }

  onMounted(async () => {
    commentStore.comments.length = 0

    window.addEventListener('scroll', () => {
      if (route.name === 'video') {
        updateMaxScrollPos()
      }
    })
  })
</script>

<template>
  <div class="m-3">
    <CommentPostInput :video="video"/>
    <Comment :comments="commentStore.comments"/>
  </div>
</template>

<style scoped>

</style>