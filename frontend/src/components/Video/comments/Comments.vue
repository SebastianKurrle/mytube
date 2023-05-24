<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useCommentStore } from "@/stores/commentStore";
  import { useRoute } from "vue-router";

  // components
  import CommentPostInput from "@/components/Video/comments/CommentPostInput.vue";

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
    }
  }

  const loadComments = async () => {
    let result:any;

    if (comments.length === 0) {
      result = await commentStore.getLatestComments('now', comments, video.value.id)
    } else {
      const lastComment:any = comments.slice(-1)
      const dateTime = lastComment.datetime_posted
      result = await commentStore.getLatestComments(dateTime, comments, video.value.id)
    }

    for (let i = 0; i < result.length; i++) {
      comments.push(result[i])
    }

    console.log(comments)
  }

  onMounted(() => {
    window.addEventListener('scroll', () => {
      if (route.name === 'video') {
        updateMaxScrollPos()
        //loadComments()
      }
    })
  })
</script>

<template>
  <div>
    <CommentPostInput :video="video"/>
  </div>
</template>

<style scoped>

</style>