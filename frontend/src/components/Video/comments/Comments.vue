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

  const comments = reactive(Array())

  const updateMaxScrollPos = () => {
    if (maxScrollPos.value < window.scrollY) {
      maxScrollPos.value = window.scrollY

      loadComments()
    }
  }

  const loadComments = async () => {
    let result = Array()

    if (comments.length === 0) {
      result = await commentStore.getLatestComments('now', video.value.id)
    } else {
      const lastComment:any = comments.slice(-1)[0]
      const dateTime = lastComment.datetime_posted
      result = await commentStore.getLatestComments(dateTime, video.value.id)
    }

    result.map(comment => {
      comments.push(comment)
    })
  }

  onMounted(async () => {
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
    <Comment :comments="comments"/>
  </div>
</template>

<style scoped>

</style>