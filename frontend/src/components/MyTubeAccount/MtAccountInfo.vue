<script setup lang="ts">
    import { onMounted, ref} from 'vue';
    import { useSubscribeStore } from "@/stores/subscribeStore";
    import { useAuthenticatedStore } from "@/stores/authenticated";
    import router from "@/router";

    const props = defineProps(['mtaccount'])

    // stores
    const subscribeStore = useSubscribeStore()
    const authenticatedStore = useAuthenticatedStore()

    const mtAccount = ref(props.mtaccount)

    const subscribed = ref()
    subscribed.value = false

    const subCount = ref()

    const loaded = ref(false)

    const checkSubscribed = async () => {
      subscribed.value = await subscribeStore.checkUserSubscribed(mtAccount.value.id)
    }

    const subscribe = async () => {
      if (!authenticatedStore.authenticated) {
        return router.push({name: 'login'})
      }

      await subscribeStore.subscribe(mtAccount.value.id)
      await checkSubscribed()
      subCount.value = await subscribeStore.countSubscribers(mtAccount.value.id)
    }

    const unsubscribe = async () => {
      if (!authenticatedStore.authenticated) {
        return router.push({name: 'login'})
      }

      await subscribeStore.unsubscribe(mtAccount.value.id)
      await checkSubscribed()
      subCount.value = await subscribeStore.countSubscribers(mtAccount.value.id)
    }

    onMounted(async () => {
      if (authenticatedStore.authenticated) {
        checkSubscribed()
      }

      subCount.value = await subscribeStore.countSubscribers(mtAccount.value.id)
      loaded.value = true
    })

</script>

<template>
    <div class="mt-3 text-white" v-if="loaded">
        <div class="box">
            <div class="content">
                <div class="w-36 h-36 rounded-full overflow-hidden">
                    <img :src="mtAccount.get_prof_picture">
                </div>
                <div class="ml-4">
                    <h2 class="text-xl md:text-3xl font-bold">{{ mtAccount.name }}</h2>
                    <p class="text-lg text-gray-500">{{ mtAccount.description }}</p>
                    <p class="text-gray-300">{{ subCount }} Subscribers</p>
                </div>
            </div>
    
            <div class="content m-3">
              <button class="bg-subutton2 p-3 rounded-3xl text-white font-semibold hover:bg-gray-600"
                      v-if="subscribed"
                      @click="unsubscribe"
              >
                Subscribed
              </button>

              <button class="bg-subbutton p-3 rounded-3xl text-black font-semibold hover:bg-gray-300"
                      v-else
                      @click="subscribe"
              >
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

.bg-subutton2 {
  background-color: #3F3F3F;
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