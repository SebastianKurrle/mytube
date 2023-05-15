import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticatedStore } from '@/stores/authenticated'
import { useCookies } from 'vue3-cookies'

// views
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/User/LoginView.vue'
import SignUpView from '@/views/User/SignUpView.vue'
import AccountView from '@/views/User/AccountView.vue'
import MyTubeAccountView from '@/views/MyTubeAccount/MyTubeAccountView.vue'
import MyTubeAccountSettingsView from '@/views/MyTubeAccount/MyTubeAccountSettingsView.vue'
import MyTubeAccountDetailView from '@/views/MyTubeAccount/MyTubeAccountDetailView.vue'
import VideoView from '@/views/Video/VideoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,

      meta: {
        requireLogin: true
      }
    },
    {
      path: '/mytube-account',
      name: 'mytube-account',
      component: MyTubeAccountView,

      meta: {
        requireLogin: true
      }
    },
    {
      path: '/:mtaccountName',
      name: 'mytube-account-detail',
      component: MyTubeAccountDetailView
    },
    {
      path: '/video/:id',
      name: 'video',
      component: VideoView,
    },
    {
      path: '/mytube-account/settings/:name',
      name: 'mytube-account-settings',
      component: MyTubeAccountSettingsView,

      meta: {
        requireLogin: true
      }
    },
  ]
})

const { cookies } = useCookies()

router.beforeEach(async (to, from, next) => {
  const authenticatedStore = useAuthenticatedStore()

  await authenticatedStore.checkToken(cookies.get('jwt'), false, true)

  if (to.matched.some(record => record.meta.requireLogin) && !authenticatedStore.authenticated) {
    next({name: 'login', query: { to: to.path }})
  } else {
    next()
  }
})

export default router
