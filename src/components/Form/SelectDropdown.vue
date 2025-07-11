<template>
  <div class="form-group">
    <label :for="name" class="form-label">{{ label }}</label>

    <div ref="wrapperRef" class="select-wrapper">
      <div
        ref="triggerRef"
        class="select-display"
        :class="attrs.disabled && 'disable-select'"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="`${name}-options`"
        :aria-haspopup="true"
        :aria-describedby="`${name}-error`"
        :aria-invalid="!!error"
        tabindex="0"
        @click="toggle"
        @keydown.down.prevent="focusNext"
        @keydown.up.prevent="focusPrev"
        @keydown.enter.prevent="selectFocused"
        @keydown.esc.prevent="close"
        v-bind="attrs"
      >
        <span v-if="value" class="selected-option">{{ value }}</span>
        <span v-else class="select-placeholder">Select an option</span>
        <span class="select-arrow">
          <ArrowDownIcon />
        </span>
      </div>

      <ul
        v-show="isOpen"
        ref="dropdownRef"
        :id="`${name}-options`"
        class="divide-y dropdown-options"
        role="listbox"
        :style="floatingStyles"
      >
        <li
          v-for="(option, index) in options"
          :key="option"
          class="dropdown-item"
          :class="{ focused: index === focusedIndex, selected: option === value }"
          role="option"
          :aria-selected="option === value"
          @click.stop="select(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>

    <span v-if="error" :id="`${name}-error`" class="form-error" role="alert">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, useAttrs } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'
import { useClickOutside } from '@/composables/useClickOutside'
import { useField } from '@/composables/useField'
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue'

const props = defineProps<{
  name: string
  label?: string
  options: string[]
}>()

const attrs = useAttrs()

// Bind to form context
const { value, error, onBlur } = useField(props.name)

// Dropdown state
const isOpen = ref(false)
const focusedIndex = ref(-1)
const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const floatingStyles = ref<Record<string, string>>({})

function toggle() {
  if (attrs.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) focusedIndex.value = -1
}

function close() {
  isOpen.value = false
  onBlur()
}

function select(option: string) {
  value.value = option
  close()
}

function focusNext() {
  if (focusedIndex.value < props.options.length - 1) focusedIndex.value++
}

function focusPrev() {
  if (focusedIndex.value > 0) focusedIndex.value--
}

function selectFocused() {
  if (focusedIndex.value >= 0) select(props.options[focusedIndex.value])
}

// Positioning
watchEffect((onInvalidate) => {
  if (!isOpen.value || !triggerRef.value || !dropdownRef.value) return
  const cleanup = autoUpdate(triggerRef.value, dropdownRef.value, async () => {
    const { x, y } = await computePosition(triggerRef.value!, dropdownRef.value!, {
      middleware: [offset(4), flip(), shift()],
      placement: 'bottom-start',
    })
    floatingStyles.value = { left: `${x}px`, top: `${y}px`, position: 'absolute' }
  })
  onInvalidate(() => cleanup())
})

useClickOutside(wrapperRef, close)
</script>

<style scoped>
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.select-wrapper {
  position: relative;
  width: 100%;
  min-width: 16rem;
}

.select-display {
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--color-slate-200);
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.disable-select {
  background: var(--color-slate-100);
  cursor: not-allowed;
}

.select-placeholder {
  color: var(--color-slate-400);
}

.selected-option {
  color: var(--color-slate-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-arrow {
  margin-left: 0.5rem;
  width: 0.8725rem;
  height: 0.8725rem;
  pointer-events: none;
  color: var(--color-slate-700);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  width: 100%;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  max-height: 16rem;
  overflow-y: auto;
  list-style: none;
  padding: 0;
}

.dropdown-options li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-options li:hover,
.dropdown-options li.focused {
  background-color: var(--color-slate-100);
  color: var(--color-slate-700);
}

.dropdown-options li.selected {
  background-color: var(--color-indigo-50);
  color: var(--color-indigo-700);
}

.dropdown-options li.selected:hover {
  background-color: var(--color-indigo-100);
  color: var(--color-indigo-500);
}

.form-error {
  color: var(--color-red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
