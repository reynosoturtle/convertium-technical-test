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
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/login')
</script>
