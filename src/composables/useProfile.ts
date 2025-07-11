import { ref, onMounted } from 'vue';
import { getUserProfile, saveUserProfile } from '@/apis/firestore';
import { useAuthStore } from '@/stores/auth';
import type { UserProfile } from '@/types/profile';
import { deepMerge } from '@/utils/deepMerge';
import { PROFILE_DEFAULT_VALUES } from '@/types/constants'

const profile = ref<UserProfile>({ ...PROFILE_DEFAULT_VALUES })
const defaultProfile: UserProfile = PROFILE_DEFAULT_VALUES

export function useProfile() {
  const authStore = useAuthStore();

  const fetchProfile = async () => {
    if (authStore.user) {
      const fetched = await getUserProfile(authStore.user.uid);
      profile.value = deepMerge(structuredClone(defaultProfile), fetched ?? {});
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