<template>
  <div class="form-group">
    <label :for="name" class="form-label">{{ label }}</label>

    <div class="form-input-wrapper">
      <span v-if="$slots.leadingIcon" class="form-icon leading">
        <slot name="leadingIcon" />
      </span>

      <input
        :id="name"
        v-model="value"
        :type="inputType"
        v-bind="attrs"
        @blur="onBlur"
        :aria-describedby="`${name}-error`"
        :aria-invalid="!!error"
        class="form-input"
        :class="{ error: !!error, 'has-leading': hasLeading, 'has-trailing': hasTrailing }"
      />

      <!-- password toggle -->
      <template v-if="type === 'password'">
        <template v-if="isVisible">
          <EyeOpenIcon
            class="form-icon trailing toggle"
            width="20"
            height="20"
            tabindex="0"
            @click="toggleVisibility"
            @keydown.enter.prevent="toggleVisibility" />
        </template>
        <template v-else>
          <EyeCloseIcon 
            class="form-icon trailing toggle"
            width="20"
            height="20"
            tabindex="0"
            @click="toggleVisibility"
            @keydown.enter.prevent="toggleVisibility" />
        </template>
      </template>

      <span v-else-if="$slots.trailingIcon" class="form-icon trailing">
        <slot name="trailingIcon" />
      </span>
    </div>

    <span
      v-if="error"
      :id="`${name}-error`"
      class="form-error"
      role="alert"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs, useSlots } from 'vue'
import { useField } from '@/composables/useField'
import EyeOpenIcon from '@/components/icons/EyeOpenIcon.vue'
import EyeCloseIcon from '@/components/icons/EyeCloseIcon.vue'

const props = defineProps<{
  name: string
  label: string
  type?: string
}>()

const attrs = useAttrs()
const slots = useSlots()

const { value, error, onBlur } = useField(props.name)

const isVisible = ref(false)
const toggleVisibility = () => void (isVisible.value = !isVisible.value)

const inputType = computed(() =>
  props.type === 'password' ? (isVisible.value ? 'text' : 'password') : props.type || 'text'
)

const hasLeading = computed(() => !!slots.leadingIcon)
const hasTrailing = computed(() => !!slots.trailingIcon || props.type === 'password')
</script>

<style scoped>
.form-input {
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--color-slate-300);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  width: 100%;
  min-width: 16rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-indigo-500);
  box-shadow: var(--shadow-input);
}

.form-input:disabled {
  background: var(--color-slate-100);
  cursor: not-allowed;
}

.form-input.error {
  border-color: #ed4245;
}

.form-input::placeholder {
  color: #a0a0a0;
}

.input-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-slate-700);
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-icon {
  position: absolute;
  color: #888;
  pointer-events: none;
}

.leading {
  left: 0.75rem;
  pointer-events: auto;
}

.trailing {
  right: 0.75rem;
  pointer-events: auto;
  cursor: pointer;
}

.form-error {
  color: var(--color-red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
