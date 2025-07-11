<template>
  <div class="form-group" ref="wrapperRef">
    <label :for="name" class="form-label">{{ label }}</label>

    <div class="multiselect-wrapper">
      <div
        ref="triggerRef"
        class="multiselect-input"
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
      >
        <span v-if="value.length" class="multiselect-tag">
          {{ value.join(', ') }}
        </span>
        <span v-else class="multiselect-placeholder">Select one or more</span>
        <!-- <span class="multiselect-arrow">▾</span> -->
        <span class="select-arrow">
          <ArrowDownIcon />
        </span>
      </div>

      <ul
        v-show="isOpen"
        ref="dropdownRef"
        :id="`${name}-options`"
        class="divide-y multiselect-options"
        role="listbox"
        aria-multiselectable="true"
        :style="floatingStyles"
      >
        <li
          v-for="(option, index) in options"
          :key="option"
          class="multiselect-item"
          :class="{ focused: index === focusedIndex, selected: value.includes(option) }"
          role="option"
          :aria-selected="value.includes(option)"
          @click.stop="toggleOption(option)"
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
import { ref, watchEffect } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'
import { useClickOutside } from '@/composables/useClickOutside'
import { useField } from '@/composables/useField'
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue'

const props = defineProps<{
  name: string
  label?: string
  options: string[]
}>()

// Bind to form context
const { value, error, onBlur } = useField(props.name)

// State
const isOpen = ref(false)
const focusedIndex = ref(-1)
const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const floatingStyles = ref<Record<string, string>>({})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) focusedIndex.value = -1
}

function close() {
  isOpen.value = false
  onBlur()
}

function toggleOption(option: string) {
  const current = value.value || []
  value.value = current.includes(option)
    ? current.filter((item: unknown) => item !== option)
    : [...current, option]
}

function focusNext() {
  if (focusedIndex.value < props.options.length - 1) focusedIndex.value++
}

function focusPrev() {
  if (focusedIndex.value > 0) focusedIndex.value--
}

function selectFocused() {
  if (focusedIndex.value >= 0) toggleOption(props.options[focusedIndex.value])
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
.multiselect-wrapper {
  position: relative;
  width: 100%;
  min-width: 16rem;
}
.multiselect-input {
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--color-slate-200);
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.multiselect-placeholder {
  color: var(--color-slate-400);
}
.multiselect-tag {
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

.multiselect-options {
  position: absolute;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  max-height: 16rem;
  overflow-y: auto;
  list-style: none;
  width: 100%;
  padding: 0;
  z-index: 1000;
}
.multiselect-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.multiselect-item.focused,
.multiselect-item:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-700);
}
.multiselect-item.selected {
  background-color: var(--color-indigo-50);
  color: var(--color-indigo-700);
}
.multiselect-item.selected:hover {
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
