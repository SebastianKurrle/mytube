<script setup lang="ts">
    import { ref } from 'vue';

    const props = defineProps(['account'])

    const account = ref(props.account)

    console.log(account)
</script>

<template>
    <div class="mt-3 text-center"   >
        <div
          class="block rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
          <h5
            class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {{ account.name }}
          </h5>
          <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {{ account.description }}
          </p>
          <button class="bg-blue-700 p-3 rounded-md text-white hover:bg-blue-800">Go to Account</button>
        </div>
    </div>
</template>

<style scoped>
</style>