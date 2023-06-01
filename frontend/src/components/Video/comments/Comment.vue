<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useAuthenticatedStore } from "@/stores/authenticated";
  import { useCommentStore } from "@/stores/commentStore";
  import moment from "moment";

  // components
  import UpdateComment from "@/components/Video/comments/UpdateComment.vue";
  import DeleteComment from "@/components/Video/comments/DeleteComment.vue";

  const props = defineProps(['comments'])

  // stores
  const authenticatedStore = useAuthenticatedStore()
  const commentStore = useCommentStore()

  const comments = reactive(props.comments)

  const getTimeAgoFromComment = (datetimeString:string) => {
    const datetime = moment(datetimeString);
    return datetime.fromNow();
  }

  const selectComment = (comment:any) => {
    commentStore.selectedComment = {
      id: comment.id,
      message: comment.message,
      user: comment.user
    }
  }
</script>

<template>
  <div class="mt-3 text-white">
    <div v-for="comment in comments" class="mb-3">
      <p>
        <span class="font-semibold mr-3">{{ comment.user.name }}</span>
        <span class="text-sm text-gray-600">{{ getTimeAgoFromComment(comment.datetime_posted) }}</span>
      </p>
      <p class="break-words">
        {{ comment.message }}
        <span v-if="authenticatedStore.authenticated && comment.user.id === authenticatedStore.user.id">
          <button
                  class="text-sm text-gray-600 mr-3 ml-3 hover:text-gray-700"
                  data-te-toggle="modal"
                  data-te-target="#updateComment"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  @click="selectComment(comment)"
          ><font-awesome-icon icon="fa-solid fa-pen" /></button>

          <button class="text-sm text-gray-600 hover:text-gray-700"
                  data-te-toggle="modal"
                  data-te-target="#deleteComment"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  @click="selectComment(comment)"
          ><font-awesome-icon icon="fa-solid fa-trash" /></button>
        </span>

        <UpdateComment />
        <DeleteComment />
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>