<script setup lang="ts">
  import { reactive } from 'vue'
  import moment from "moment";

  const props = defineProps(['comments'])

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
      <p class="break-words">{{ comment.message }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>