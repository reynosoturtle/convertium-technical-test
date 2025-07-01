import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});


export default router;
