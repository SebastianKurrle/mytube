<script setup lang="ts">
    import { ref } from 'vue';

    const props = defineProps(['mtaccount'])

    const mtaccount = props.mtaccount
</script>

<template>
    <div class="mt-3 text-white">
        <div class="box">
            <div class="content">
                <div class="w-36 h-36 rounded-full overflow-hidden">
                    <img :src="mtaccount.get_prof_picture">
                </div>
                <div class="ml-4">
                    <h2 class="text-3xl font-bold">{{ mtaccount.name }}</h2>
                    <p class="text-lg text-gray-500">{{ mtaccount.description }}</p> 
                </div>
            </div>
    
            <div class="content">
                <button class="bg-subbutton p-3 rounded-3xl text-black font-semibold hover:bg-gray-300">
                    Subscribe
                </button>
            </div>
        </div>

        <hr class="mt-3"/>
    </div>    
</template>

<style scoped>

.bg-subbutton {
    background-color: #D9D9D9;
}

.content {
    display: flex;
    align-items: center;
    margin-top: 50px;
}

@media (min-width: 800px) {
    .box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>