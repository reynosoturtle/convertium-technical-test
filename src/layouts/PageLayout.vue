<template>
	<MainNavBar></MainNavBar>

	<div class="page-buffer">
		<slot />
	</div>
</template>

<script setup lang="ts">
import MainNavBar from '@/components/MainNavBar.vue'
</script>

<style scoped>
.page-buffer {
  margin-top: 5rem;
}
</style>