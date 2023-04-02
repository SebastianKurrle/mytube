import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticatedStore } from '@/stores/authenticated'
import { useCookies } from 'vue3-cookies'

// views
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import AccountView from '@/views/AccountView.vue'
import CreateMyTubeAccount from '@/views/CreateMyTubeAccount.vue'

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
      path: '/mytube-account/create',
      name: 'mytube-create',
      component: CreateMyTubeAccount,

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
