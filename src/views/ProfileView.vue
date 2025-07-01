<template>
  <div>
    <h1>My Profile</h1>
    <div v-if="profile">
      <p><strong>First Name:</strong> {{ profile.firstName }}</p>
      <p><strong>Last Name:</strong> {{ profile.lastName }}</p>
      <p><strong>Date of Birth:</strong> {{ profile.dateOfBirth }}</p>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfile } from '@/composables/useProfile'

const { profile, fetchProfile, updateProfile } = useProfile()

const generateProfile = async () => {
  try {
    console.log(profile.value)
    await fetchProfile()
    console.log(profile.value)
  } catch (error) {
    console.error(error)
  }

  try {
    console.log(profile.value)
    await updateProfile({
      firstName: 'Christian',
      lastName: 'Reynoso',
      dateOfBirth: '12/12/1996',
    })
    console.log(profile.value)
  } catch (error) {
    console.error(error)
  }
}

generateProfile()
</script>
