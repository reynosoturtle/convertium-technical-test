<template>
  <div class="main">
    <!-- Left Side -->
    <div class="left-side">
			<div class="card">
				<div class="">
					<h1 class="title">Welcome back 👋</h1>
					<p class="desc">Please enter your credentials to sign in to your account.</p>
				</div>

				<form @submit.prevent="handleSubmit" class="form">
					<div class="input-group">
						<label class="label">Email</label>
						<input v-model="formData.email" type="email" required class="input" :class="{ 'error': errors.email }" placeholder="Enter your email" />
						<span v-if="errors.email" class="error-text">{{ errors.email }}</span>
					</div>

					<div class="input-group">
						<label class="label">Password</label>
						<div class="password-box">
							<input v-model="formData.password" :type="showPassword ? 'text' : 'password'" required class="input" :class="{ 'error': errors.password }" placeholder="Enter your password" />
							<button type="button" @click="togglePassword" class="eye-btn">
								<svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
									<line x1="1" y1="1" x2="23" y2="23"/>
								</svg>
								<svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
									<circle cx="12" cy="12" r="3"/>
								</svg>
							</button>
						</div>
						<span v-if="errors.password" class="error-text">{{ errors.password }}</span>
					</div>

					<div class="options">
						<div class="checkbox-area">
							<input id="remember-me" v-model="formData.rememberMe" type="checkbox" class="checkbox">
							<label for="remember-me" class="checkbox-text">Remember me</label>
						</div>
						<a href="#" class="forgot-link">Forgot password?</a>
					</div>

					<button type="submit" class="login-btn" :disabled="isLoading">
						<span v-if="isLoading" class="spinner"></span>
						{{ isLoading ? 'Signing in...' : 'Sign In' }}
					</button>
				</form>

				<div class="divider">
					<span class="divider-text">Or sign in with</span>
				</div>

				<div class="social-btns">
					<button type="button" class="social-btn">
						<img src="../assets/google.svg" alt="Google" width="20" height="20" />
						Google
					</button>
					<button type="button" class="social-btn">
						<img src="../assets/facebook.svg" alt="Facebook" width="20" height="20" />
						Facebook
					</button>
				</div>

				<div class="signup">
					<p class="signup-text">
						Don't have an account? 
						<a href="#" class="signup-link">Sign up</a>
					</p>
				</div>
			</div>
    </div>

    <!-- Right Side -->
    <div class="right-side">
			<div class="art"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login, register } from '@/apis/auth'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

type FormType = 'signIn' | 'register'

const formType = ref<FormType>('signIn')
const formData = reactive<FormData>({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive<FormErrors>({})
const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}

const toggleFormType = () => {
  if (formType.value === 'signIn') formType.value = 'register'
  else formType.value = 'signIn'
}

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    errors.email = 'Email is required'
    return false
  } else if (!regex.test(email)) {
    errors.email = 'Please enter a valid email address'
    return false
  } else {
    return true
  }
}

const validatePassword = (password: string): boolean => {
  const minLength = 6

  if (!password) {
    errors.password = 'Password is required'
    return false
  } else if (password.length < minLength) {
    errors.password = 'Password must be at least 6 characters'
    return false
  } else {
    return true
  }
}

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
  return validateEmail(formData.email) && validatePassword(formData.password)
}

const resetSignInForm = () => {
  formData.email = ''
  formData.password = ''
  formData.rememberMe = false
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const response = await login(formData.email, formData.password, formData.rememberMe)
    authStore.setUser({ uid: response.user.uid, email: response.user.email })
    resetSignInForm()
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
}

/* Main Grid Layout */
.main {
  min-height: 100vh;
  display: grid;
  /* padding: 1rem; */
  gap: 2.5rem;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
}

.left-side {
  grid-column: span 4 / span 4;
  display: flex;
  justify-content: center;
  place-items: center;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: start;
  padding: 2rem;
  gap: 1rem;
  max-width: 500px;
}

.art {
  background-image: url('../assets/art.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  display: grid;
  place-items: center;
  grid-column: span 4 / span 4;
  border-radius: 1rem;
}

.big-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

.right-side {
  position: relative;
  display: grid;
  place-items: center;
  grid-column: span 4 / span 4;

  background-image: url('../assets/art.jpg');
  background-size: cover;
  background-position: center;

  /* border-radius: 1.5rem; */
  border-radius: 1.5rem 0 0 1.5rem;

  box-shadow: inset 1rem 0.75rem 0.5rem rgb(0 0 0 / 0.75);
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
}

.desc {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

/* Form Grid */
.form {
  margin-top: 0.5rem;
  width: 100%;
  display: grid;
  gap: 1.25rem;
}

.input-group {
  display: grid;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.input {
  padding: 0.875rem 1rem;
  border: 1.5px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
}

.input:focus {
  outline: none;
  border-color: #5865f2;
  box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.1);
}

.input.error {
  border-color: #ed4245;
}

.input::placeholder {
  color: #a0a0a0;
}

.password-box {
  position: relative;
  display: grid;
}

.eye-btn {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.eye-btn:hover {
  color: #333;
}

.error-text {
  font-size: 0.8rem;
  color: #ed4245;
}

/* Options Grid */
.options {
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.checkbox-area {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #5865f2;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #333;
}

.forgot-link {
  font-size: 0.875rem;
  color: #5865f2;
  text-decoration: none;
  font-weight: 500;
  justify-self: end;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  background: #5865f2;
  color: white;
  border: none;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  justify-content: center;
  place-items: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  background: #4752c4;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  position: relative;
  text-align: center;
  width: 100%;
  display: flex;
  gap: 0.5rem;
  place-items: center;
}

.divider::before,
.divider::after {
  flex: 1;
  background-color: #e1e5e9;
  content: '';
  height: 1px;
  vertical-align: middle;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #666;
  font-size: 0.875rem;
}

/* Social Buttons Grid */
.social-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

.social-btn {
  display: grid;
  grid-template-columns: auto 1fr;
  place-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.social-btn img {
  grid-column: 1;
}

.signup {
  margin-top: 0.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  place-items: center;
}

.signup-text {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.signup-link {
  color: #5865f2;
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Mobile Grid */
@media (max-width: 768px) {
  .main {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    /* grid-template-rows: 40vh 1fr; */
  }

  .left-side {
    grid-column: span 6 / span 6;
  }

  .right-side {
    order: -1;
    grid-column: span 6 / span 6;
  }

  .big-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .social-btns {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .options {
    grid-template-columns: 1fr;
    justify-items: start;
    gap: 1rem;
  }

  .forgot-link {
    justify-self: start;
  }
}

@media (max-width: 480px) {
  .main {
    grid-template-rows: 35vh 1fr;
  }

  .big-title {
    font-size: 1.75rem;
  }

  .right-side {
    padding: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
