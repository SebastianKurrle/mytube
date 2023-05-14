<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const props = defineProps(['mtaccountID'])

    const loaded = ref(false)
    const mtaccount = ref()

    onMounted(async () => {
        mtaccount.value = await myTubeAccountStore.getMyTubeAccountById(String(props.mtaccountID))
        loaded.value = true
    })
</script>

<template>
    <div v-if="loaded" class="mt-3">
        <div class="flex items-center">
            <div class="w-16 h-16 rounded-full overflow-hidden">
              <img :src="mtaccount.get_prof_picture">
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-bold">{{ mtaccount.name }}</h2>
              <!-- <p class="text-sm text-gray-500"></p> subscribers--> 
            </div>
          </div>          
    </div>
</template>

<style scoped>
</style>