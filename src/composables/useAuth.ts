import { ref, onMounted, computed } from 'vue';
import { auth } from '@/apis/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/stores/auth';

const initialized = ref(false);

export function useAuth() {
  const store = useAuthStore();

  onMounted(() => {
    if (initialized.value) return;
    onAuthStateChanged(auth, (user) => {
      store.setUser(user ? { uid: user.uid, email: user.email } : null);
      initialized.value = true;
      
      console.log('useAuth initialized', user)
    });
  });

  return {
    user: store.user,
    isAuthenticated: computed(() => !!store.user)
  };
}
