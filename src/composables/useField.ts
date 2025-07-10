// src/composables/useField.ts
import { inject, computed } from 'vue'
import { FORM_CONTEXT } from '@/composables/formContext'
import type { FormContext } from '@/composables/useForm'
import { getAtPath, setAtPath } from '@/utils/formPath'

export function useField(path: string) {
  const form = inject<FormContext<any>>(FORM_CONTEXT)
  if (!form) {
    throw new Error('useField must be used inside a useForm context')
  }

  // getter / setter against nested values
  const value = computed({
    get: () => getAtPath(form.values.value, path),
    set: (v: any) => {
      setAtPath(form.values.value, path, v)
      form.setFieldValue(path, getAtPath(form.values.value, path))
    },
  })

  const error = computed(() => form.errors.value[path] || null)
  const touched = computed(() => !!form.touched.value[path])
  const dirty   = computed(() => !!form.dirty.value[path])

  const onBlur = () => {
    form.setFieldTouched(path, true)
    form.validateField(path)
  }

  return { value, error, touched, dirty, onBlur }
}
