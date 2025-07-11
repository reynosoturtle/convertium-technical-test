export const componentMap = {
  DatePicker: () => import('@/components/Form/DatePicker.vue'),
  TextInput: () => import('@/components/Form/TextInput.vue'),
  SelectDropdown: () => import('@/components/Form/SelectDropdown.vue'),
  MultiSelectDropdown: () => import('@/components/Form/MultiSelectDropdown.vue'),
  FileUpload: () => import('@/components/Form/FileUpload.vue'),
  ProfileImage: () => import('@/components/ProfileImage.vue'),
} as const

export type ComponentKey = keyof typeof componentMap

export interface FieldDescriptor {
  component: ComponentKey
  label: string
  props: Record<string, any>
  attributes?: Record<string, any>
}

export interface SectionDescriptor {
  id: string
  key: string
  title: string
  description: string
  fields: FieldDescriptor[]
}
