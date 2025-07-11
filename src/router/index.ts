import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/apis/firebase'

const routes: RouteRecordRaw[] = [
  // { path: '/', component: HomeViewa },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 108,
      };
    }
    return savedPosition || { left: 0, top: 0 };
  }
});

let isAuthReady = false

router.beforeEach(async (to, from, next) => {
  if (!isAuthReady) {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        isAuthReady = true
        unsubscribe()
        resolve(true)
      })
    })
  }
  
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.user) next('/login')
  else if (['/login'].includes(to.path) && authStore.user) next('/profile')
  else next()
});


export default router;
