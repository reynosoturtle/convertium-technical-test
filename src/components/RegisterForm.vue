<template>
	<form class="form" @submit.prevent="handleSubmit(handleRegister)()">
		<TextInput name="email" label="Email" type="email" />
		<TextInput name="password" label="Password" type="password" />
		<TextInput name="confirmPassword" label="Confirm Password" type="password"/>

		<Button type="submit" variant="primary">
			Create Account
		</Button>
	</form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { register } from '@/apis/auth'
import { useForm } from '@/composables/useForm'
import { registerSchema } from '@/schemas/authSchema'
import { useAuthStore } from '@/stores/auth'
import { useProfile } from '@/composables/useProfile'
import TextInput from '@/components/Form/TextInput.vue'
import Button from '@/components/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const { profile, generateDefaultProfile } = useProfile()
const { resetForm, handleSubmit } = useForm(
  {
    email: '',
    password: '',
    confirmPassword: '',
  },
  registerSchema
)

const handleRegister = async (values: {
  email: string
  password: string
  confirmPassword: string
}) => {
  try {
    const user = await register(values.email, values.password)
    authStore.setUser({ uid: user.uid, email: user.email })
    await generateDefaultProfile({ uid: user.uid, email: user.email })
    console.log(profile)
    resetForm()
    router.push('/profile')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
</style>
