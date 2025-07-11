<template>
	<span class="container full-size" :class="mode === 'button' ? 'container-button-mode' : 'container-display-mode'">
    <img v-if="profile?.profileImage" class="full-size" :src="url ? url : profile?.profileImage" width=""/>
		<AvatarIcon v-else class="avatar full-size" :class="mode === 'button' ? 'avatar-button-mode' : 'avatar-display-mode'" />
  </span>
</template>

<script setup lang="ts">
import { useProfile } from '@/composables/useProfile.ts'
import AvatarIcon from '@/components/icons/AvatarIcon.vue'

const { profile } = useProfile()

type ProfileImageMode = 'display' | 'button'

defineProps<{
  mode: ProfileImageMode
  url?: string | null
}>()
</script>

<style scoped>
.container {
  display: inline-block;
  overflow: hidden;
  border-radius: 50%;
  border: solid 2px var(--color-indigo-400);
  background-color: var(--color-indigo-300);
}

.container-button-mode:hover {
  border: solid 2px var(--color-indigo-300);
  background-color: var(--color-indigo-200);
}

.container-display-mode:hover {
}

.avatar {
  color: var(--color-indigo-800);
}

.avatar-button-mode:hover {
  color: var(--color-indigo-700);
}

.avatar-display-mode:hover {
}
</style>