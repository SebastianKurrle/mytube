<script setup lang="ts">
import { onMounted, onBeforeMount ,ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useAuthenticatedStore } from './stores/authenticated';
import { RouterView } from 'vue-router';
import axios from 'axios';

// components
import Navbar from './components/Navbar.vue'
import Searchbar from './components/Searchbar.vue';
</script>

<template>
  <div class="h-screen bg-neutral-800">
    <header>
      <Navbar />
    </header>

    <main class="container m-auto">
      <Searchbar />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
