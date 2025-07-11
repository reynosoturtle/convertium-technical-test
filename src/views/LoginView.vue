<template>
  <div class="main">
    <!-- Left Side -->
    <div class="left-side">
			<div class="card">
				<div v-if="mode === 'signin'">
					<h1 class="title">Welcome back 👋</h1>
					<p class="desc">Please enter your credentials to sign in to your account.</p>
				</div>
				<div v-else>
					<h1 class="title">Hello there 👋</h1>
					<p class="desc">Please enter your desired credentials to sign up for an account.</p>
				</div>

        <LoginForm v-if="mode === 'signin'" />
        <RegisterForm v-else />

				<div class="divider">
					<p class="divider-text">
            <template v-if="mode === 'signin'">
              Don't have an account? 
              <a class="mode-toggle" @click="toggleMode">Sign up</a>
              instead
            </template>
            <template v-else>
              Already have an account? 
              <a class="mode-toggle" @click="toggleMode">Sign in</a>
              instead
            </template>
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
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const mode = ref<'signin' | 'signup'>('signin')

const toggleMode = () => {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
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

.error-text {
  font-size: 0.8rem;
  color: #ed4245;
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

.mode-toggle {
  color: var(--color-indigo-700);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0rem 0.125rem;
}

.mode-toggle:hover {
  text-decoration: underline;
}

/* Mobile Grid */
@media (max-width: 768px) {
  .main {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
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
