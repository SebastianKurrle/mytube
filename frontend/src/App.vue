<script setup lang="ts">
import { onMounted, onBeforeMount ,ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useAuthenticatedStore } from './stores/authenticated';
import { RouterView } from 'vue-router';
import axios from 'axios';

// components
import Navbar from './components/Navbar/Navbar.vue'
</script>

<template>
  <div class="h-screen main-bg">
    <header>
      <Navbar />
    </header>

    <main class="mt-3 md:container md:m-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
