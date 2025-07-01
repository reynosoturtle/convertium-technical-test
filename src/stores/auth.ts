import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { FirebaseUser } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<FirebaseUser | null>(null);

  const setUser = (newUser: FirebaseUser | null) => {
    user.value = newUser;
  };

  return { user, setUser };
});
