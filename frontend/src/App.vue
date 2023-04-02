<script setup lang="ts">
import { onMounted, onBeforeMount ,ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useAuthenticatedStore } from './stores/authenticated';
import axios from 'axios';

// components
import Sidebar from './components/Sidebar.vue'

// stores
const authenticatedStore = useAuthenticatedStore()

const { cookies } = useCookies()

// onBeforeMount(async() => {
//   await authenticatedStore.checkToken(cookies.get('jwt'), false)
// })
</script>

<template>
  <div>
      <header>
        <Sidebar />
      </header>
  </div>
</template>

<style scoped>
</style>
