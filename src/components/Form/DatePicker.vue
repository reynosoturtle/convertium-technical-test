<template>
  <div class="form-group">
    <label :for="name" class="form-label">{{ label }}</label>

    <input
      :id="name"
      type="date"
      class="form-date"
      v-model="modelValue"
      :aria-describedby="`${name}-error`"
      :aria-invalid="!!error"
      @blur="onBlur"
      v-bind="attrs"
    />

    <span
      v-if="error"
      :id="`${name}-error`"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { useField } from '@/composables/useField'

const props = defineProps<{
  name: string
  label: string
}>()

const attrs = useAttrs()
const { value: rawValue, error, onBlur } = useField(props.name)

// Compute an ISO date string for <input type="date"> from raw DD/MM/YYYY or ISO
const modelValue = computed({
  get(): string {
    const val = rawValue.value ?? ''
    // If DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
      const [day, month, year] = val.split('/')
      return `${year}-${month}-${day}`
    }
    // If already ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val
    }
    return ''
  },
  set(v: string) {
    // v is YYYY-MM-DD, store back as ISO for validation
    rawValue.value = v
  },
})
</script>

<style scoped>
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.form-date {
  padding: 0.5rem 1rem;
  border: 1.5px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  width: 100%;
  min-width: 16rem;
}

.form-date:focus {
  outline: none;
  border-color: var(--color-indigo-500);
  box-shadow: var(--shadow-input);
}

.form-error {
  color: var(--color-red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
