import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import EditProfileView from '../views/EditProfileView.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/apis/firebase'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/edit-profile', component: EditProfileView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
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
  else next()
});


export default router;
