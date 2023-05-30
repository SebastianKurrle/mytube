<script setup lang="ts">
  import { reactive } from 'vue'
  import { useAuthenticatedStore } from "@/stores/authenticated";
  import moment from "moment";

  const props = defineProps(['comments'])

  // stores
  const authenticatedStore = useAuthenticatedStore()

  const comments = reactive(props.comments)

  const getTimeAgoFromComment = (datetimeString:string) => {
    const datetime = moment(datetimeString);
    return datetime.fromNow();
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
          <span class="text-sm text-gray-600 mr-3 ml-3"><font-awesome-icon icon="fa-solid fa-pen" /></span>
          <span class="text-sm text-gray-600"><font-awesome-icon icon="fa-solid fa-trash" /></span>
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>