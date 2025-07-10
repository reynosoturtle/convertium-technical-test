<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <button 
      class="button"
      :class="variantClass"
      :disabled="disabled" 
      :type="type" 
      @click="$emit('action')">
      <slot v-if="$slots.leadingIcon" name="leadingIcon" />
      <slot />
      <slot v-if="$slots.trailingIcon" name="trailingIcon" />
    </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'warning' | 'danger'

const props = defineProps<{
  disabled: boolean
  type: 'button' | 'reset' | 'submit'
  variant: ButtonVariant
}>()

defineEmits<{
  (e: 'action'): void
}>()

const variantClass = computed(() => props.variant)
</script>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 400;
  gap: 0.5rem;
  padding: 0.875rem 1.125rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button:active:not(:disabled) {
  transform: translateY(1px);
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.primary {
  background: var(--color-indigo-500);
  color: white;
}

.primary:hover:not(:disabled) {
  background: var(--color-indigo-600);
}

.primary:active:not(:disabled) {
  background: var(--color-indigo-400);
}

.secondary {
  background: var(--color-emerald-500);
  color: white;
}

.secondary:hover:not(:disabled) {
  background: var(--color-emerald-600);
}

.secondary:active:not(:disabled) {
  background: var(--color-emerald-400);
}

.neutral {
  background: var(--color-slate-100);
  color: var(--color-slate-700);
}

.neutral:hover:not(:disabled) {
  background: var(--color-slate-200);
}

.neutral:active:not(:disabled) {
  background: var(--color-slate-50);
}

.warning {
  background: var(--color-amber-500);
  color: white;
}

.warning:hover:not(:disabled) {
  background: var(--color-amber-600);
}

.warning:active:not(:disabled) {
  background: var(--color-amber-400);
}

.danger {
  background: var(--color-red-500);
  color: white;
}

.danger:hover:not(:disabled) {
  background: var(--color-red-600);
}

.danger:active:not(:disabled) {
  background: var(--color-red-400);
}
</style>