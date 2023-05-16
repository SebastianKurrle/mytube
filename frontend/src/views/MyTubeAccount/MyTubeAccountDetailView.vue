<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useMyTubeAccountStore } from '@/stores/mytubeAccount';

    // components
    import MtAccountInfo from '@/components/MyTubeAccount/MtAccountInfo.vue';
    import MtAccountVideos from '@/components/Video/MtAccountVideos.vue';

    const route = useRoute()

    // stores
    const myTubeAccountStore = useMyTubeAccountStore()

    const loaded = ref(false)

    const mtaccount = ref()

    onMounted(async () => {
        const name = String(route.params.mtaccountName)
        mtaccount.value = await myTubeAccountStore.getMyTubeAccount('name', name)
        loaded.value = true
    })
</script>

<template>
    <div v-if="loaded" class="text-white">
        <MtAccountInfo :mtaccount="mtaccount"/>
        <MtAccountVideos :mtaccount="mtaccount"/>
    </div>
</template>

<style scoped>
</style>