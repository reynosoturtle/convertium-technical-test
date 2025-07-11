import { ref, provide, computed, inject, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { Schema } from 'yup'
import { FORM_CONTEXT } from '@/composables/formContext'

export function useForm<T extends Record<string, any>>(initialValues: T, schema: Schema<T>) {
  const initial = ref<T>(JSON.parse(JSON.stringify(initialValues)))

  const values = ref<T>({ ...initial.value })
  const errors = ref<Record<string, string | null>>({})
  const touched = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const dirty = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const isSubmitting = ref(false)

  const isValid = computed(() => Object.values(errors.value).every((error) => error === null))

  const setFieldValue = (path: string, value: any) => {
    values.value[path] = value
    dirty.value[path] = true
  }

  const setFieldTouched = <K extends keyof T>(key: K, isTouched = true) => {
    touched.value[key] = isTouched
  }

  const setErrors = (customErrors: Record<string, string>) => {
    errors.value = { ...errors.value, ...customErrors }
  }

  const validate = async (): Promise<boolean> => {
    try {
      await schema.validate(values.value, { abortEarly: false })
      errors.value = {} as Record<keyof T, string | null>
      return true
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {}
      if (err.inner) {
        err.inner.forEach((e: any) => {
          fieldErrors[e.path as string] = e.message
        })
      }
      errors.value = fieldErrors as Record<keyof T, string | null>
      return false
    }
  }

  const validateField = async (key: keyof T): Promise<void> => {
    try {
      await schema.validateAt(key as string, values.value)
      const errMap = errors.value as Record<string, string | null>;
      errMap[key as string] = null;
    } catch (err: any) {
      (errors.value as Record<string, string | null>)[key as string] = err.message
    }
  }

  const resetForm = (newValues?: Partial<T>) => {
    const resetTo = { ...initial.value, ...(newValues || {}) }
    values.value = resetTo
    errors.value = {} as Record<keyof T, string | null>
    touched.value = {} as Record<keyof T, boolean>
    dirty.value = {} as Record<keyof T, boolean>
  }

  const handleSubmit = (callback: (vals: T) => Promise<void> | void) => {
    return async () => {
      isSubmitting.value = true
      const isValid = await validate()
      if (isValid) await callback({ ...values.value })
      isSubmitting.value = false
    }
  }

  provide(FORM_CONTEXT, {
    values,
    errors,
    touched,
    dirty,
    setFieldValue,
    setFieldTouched,
    validateField,
  })

  watch(
    () => initialValues,
    (newInitial) => {
      const deepCopy = JSON.parse(JSON.stringify(newInitial))
      initial.value = deepCopy
      values.value = { ...deepCopy }
    },
    { deep: true }
  )

  return {
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    isValid,
    handleSubmit,
    validate,
    validateField,
    resetForm,
    setFieldValue,
    setFieldTouched,
    setErrors,
  }
}

export const useFormContext = () => {
  const ctx = inject(FORM_CONTEXT)
  if (!ctx) {
    throw new Error('useFormContext must be used within a useForm() provider.')
  }
  return ctx
}

export type FormContext<T extends Record<string, any>> = {
  values: Ref<T>
  errors: Ref<Record<keyof T, string | null>>
  touched: Ref<Record<keyof T, boolean>>
  dirty: Ref<Record<keyof T, boolean>>
  setFieldValue: (key: string, value: any) => void
  setFieldTouched: <K extends keyof T>(key: K, touched?: boolean) => void
  validateField: (key: keyof T) => Promise<void>
  handleSubmit: (cb: (vals: T) => void | Promise<void>) => () => Promise<void>
  validate: () => Promise<boolean>
  resetForm: (vals?: Partial<T>) => void
  isSubmitting: Ref<boolean>
  isValid: ComputedRef<boolean>
  setErrors: (customErrors: Partial<Record<keyof T, string>>) => void
}
