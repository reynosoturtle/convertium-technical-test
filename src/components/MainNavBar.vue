<template>
	<div class="navbar">
		<div class="logo-container">
			<LogoIcon class="logo" />
      <span class="logo-title">MEOW<br/>TECH</span>
		</div>

		<div class="others-container">
			<div class="icon-container">
				<NotificationIcon class="notification" />
			</div>

			<div ref="wrapper" class="avatar-container">
				<ProfileImage mode="button" ref="reference" @click="toggleMenuIsOpen" />

        <!-- Floating Menu -->
        <ul v-if="menuIsOpen" ref="floating" :style="floatingStyles" class="divide-y menu">
          <span class="menu-greeting">Welcome back, {{ `${profile.firstName} ${profile.lastName}` }}!</span>
          <div class="menu-item-group">
            <li class="menu-item">
              <a class="menu-item-label" @click="router.push('/profile')">Profile</a>
            </li>
            <li class="menu-item">
              <a class="menu-item-label">Payment Methods</a>
            </li>
          </div>
          <div class="menu-item-group">
            <li class="menu-item" @click="handleLogout">
              <a class="menu-item-label">Sign Out</a>
            </li>
          </div>
        </ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { offset, useFloating } from '@floating-ui/vue'
import { logout } from '@/apis/auth'
import { useProfile } from '@/composables/useProfile.ts'
import { useClickOutside } from '@/composables/useClickOutside.ts'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import NotificationIcon from '@/components/icons/NotificationIcon.vue'
import ProfileImage from '@/components/ProfileImage.vue'

const { profile, resetProfile } = useProfile()
const router = useRouter()

const wrapper = ref<HTMLElement | null>(null)
const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)
const { floatingStyles } = useFloating(reference, floating, {
  placement: 'bottom-end',
  middleware: [offset(10)],
})
const menuIsOpen = ref<boolean>(false)
const toggleMenuIsOpen = (boolean: boolean = !menuIsOpen.value) => {
  menuIsOpen.value = boolean
}
useClickOutside(wrapper, () => {
  toggleMenuIsOpen(false)
})

const handleLogout = async () => {
  await logout()
  resetProfile()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: var(--color-indigo-600);
  display: flex;
  justify-content: space-between;
  justify-items: center;
  padding: 1.5rem 2.5rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: var(--z-navbar);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  cursor: pointer;
}

.logo {
  height: 2.35rem;
  color: var(--color-indigo-200);
}

.logo-title {
  font-weight: 700;
  font-size: 1.325rem;
  line-height: 1.175rem;
  color: var(--color-indigo-200);
}

.others-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.875rem;
}

.icon-container {
  width: 1.75rem;
  height: 1.75rem;
}

.icon-container:hover {
  width: 1.75rem;
  height: 1.75rem;
}

.notification {
  color: var(--color-indigo-400);
}

.notification:hover {
  color: var(--color-indigo-300);
}

.avatar-container {
  width: 2.35rem;
  height: 2.35rem;
  cursor: pointer;
}

.menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 0.125rem 0rem;
  background-color: var(--color-slate-100);
  box-shadow: var(--shadow-md);
  border-radius: 0.5rem;
  list-style: none;
  width: max-content;
  min-width: 12rem;
  overflow: hidden;
}

.menu-greeting {
  color: var(--color-slate-700);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 1rem 1rem;
  cursor: auto;
}

.menu-item-group {
  display: flex;
  flex-direction: column;
}

.menu-item-group:first-child {
  display: flex;
  flex-direction: column;
  border-top: solid 1px var(--color-slate-300);
}

.menu-item-group:last-child {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px var(--color-slate-300);
}

.menu-item {
  cursor: pointer;
  height: auto;
  padding: 0.5rem 1rem;
  width: 100%;
}

.menu-item:hover {
  background-color: var(--color-slate-200);
}

.menu-item-label {
  color: var(--color-slate-500);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>