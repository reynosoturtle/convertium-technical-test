import { ref, onMounted } from 'vue';
import { getUserProfile, saveUserProfile } from '@/apis/firestore';
import { useAuthStore } from '@/stores/auth';
import type { UserProfile } from '@/types/profile';

const profile = ref<UserProfile | null>(null);

export function useProfile() {
  const authStore = useAuthStore();

  const fetchProfile = async () => {
    if (authStore.user) {
      profile.value = await getUserProfile(authStore.user.uid);
    }
  };

  const updateProfile = async (data: UserProfile) => {
    if (authStore.user) {
      await saveUserProfile(authStore.user.uid, data);
      profile.value = data;
    }
  };

  onMounted(fetchProfile);

  return {
    profile,
    fetchProfile,
    updateProfile
  };
}
