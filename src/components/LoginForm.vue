<template>
	<form class="form" @submit.prevent="handleSubmit(handleLogin)()">
		<TextInput name="email" label="Email" type="email" />
		<TextInput name="password" label="Password" type="password" />
		<div class="checkbox-container">
			<label><input name="remember" type="checkbox" />Remember Me</label>
		</div>

		<Button type="submit" variant="primary">
			Sign In
		</Button>
	</form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { login } from '@/apis/auth'
import { useForm } from '@/composables/useForm'
import { loginSchema } from '@/schemas/authSchema'
import { useAuthStore } from '@/stores/auth'
import TextInput from '@/components/Form/TextInput.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const { resetForm, handleSubmit } = useForm(
  {
    email: '',
    password: '',
    remember: false,
  },
  loginSchema
)

const handleLogin = async ({
  email,
  password,
  remember = false,
}: {
  email: string
  password: string
  remember?: boolean
}) => {
  try {
    const user = await login(email, password, remember)
    authStore.setUser({ uid: user.uid, email: user.email })
    resetForm()
    router.push('/profile')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
input[type='checkbox'] {
  margin-right: 0.5rem;
}
</style>
