import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueCookies from 'vue-cookies'

import './assets/main.css'
import 'tw-elements/dist/js/index.min.js'
import 'vue3-toastify/dist/index.css'

// fontawsome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.withCredentials = true

library.add(fas)
library.add(far)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(VueCookies)

app.mount('#app')
