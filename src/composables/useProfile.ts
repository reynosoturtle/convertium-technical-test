import { ref, onMounted } from 'vue';
import { getUserProfile, saveUserProfile } from '@/apis/firestore';
import { useAuthStore } from '@/stores/auth';
import type { UserProfile } from '@/types/profile';
import { deepMerge } from '@/utils/deepMerge';

const profile = ref<UserProfile | null>(null);

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  spouse: {
    firstName: '',
    lastName: '',
    salutation: '',
  },
  preferences: {
    hobbies: [],
    musicGenres: [],
    movieGenres: [],
    sports: [],
  },
  additionalInformation: {
    dateOfBirth: '',
    address: '',
    country: '',
    postalCode: '',
    gender: '',
    maritalStatus: '',
  },
};

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