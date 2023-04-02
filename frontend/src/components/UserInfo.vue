<script setup lang="ts">
  import { useAuthenticatedStore } from '@/stores/authenticated';

  // stores
  const authenticatedStore = useAuthenticatedStore()
</script>

<template>
    <div>
        <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden rounded-md">
                  <table class="min-w-full text-sm font-light text-center text-white">
                    <thead
                      class="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                      <tr>
                        <th scope="col" class="px-6 py-4"><font-awesome-icon icon="fa-solid fa-envelope" /> Email</th>
                        <th scope="col" class="px-6 py-4">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700">
                        <td class="whitespace-nowrap px-6 py-4">{{ authenticatedStore.user.email }}</td>
                        <td class="whitespace-nowrap px-6 py-4">{{ authenticatedStore.user.name }}</td> 
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>