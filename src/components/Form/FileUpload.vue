<template>
  <div class="form-group">
		<div class="preview-group">
			<div class="preview-container">
				<ProfileImage mode="display" :url="previewUrl" />
			</div>
			<div class="preview-controls">
				<Button type="button" variant="neutral" @action="removeFile">
					<template #leadingIcon>
						<TrashIcon class="trash-icon" />
					</template>
					Delete
				</Button>
			</div>
		</div>

		<input
			ref="fileInput"
			type="file"
			accept="image/jpeg, image/png"
			class="file-input"
			@change="onFileInputChange"
			:id="name"
			hidden
		/>
		
    <div
      class="file-dropzone"
      :class="{ 'is-dragover': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <label :for="name" class="dropzone-content">
				<ImageIcon class="image-icon" />
				<p class="instructions">
					<a>Upload an image</a>
					or drag and drop<br/>
					<span>PNG, JPG up to 5MB</span>
				</p>
      </label>
    </div>

    <span v-if="error" :id="`${name}-error`" class="form-error" role="alert">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useField } from '@/composables/useField'
import { uploadProfileImage } from '@/apis/storage'
import ProfileImage from '@/components/ProfileImage.vue'
import Button from '@/components/Button.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'

const props = defineProps<{
  name: string
  label?: string
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const isDragOver = ref(false)

const { value, error, setErrors, onBlur } = useField<string>(props.name)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeFile = () => {
  previewUrl.value = null
  value.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const validateFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png']
  const maxMB = 5
  if (!validTypes.includes(file.type)) return 'Only JPEG and PNG images are allowed.'
  if (file.size > maxMB * 1024 * 1024) return `File must be < ${maxMB}MB.`
  return null
}

const uploadAndSet = async (file: File) => {
  const errMsg = validateFile(file)
  if (errMsg) {
    setErrors(errMsg)
    return
  }

  try {
    const url = await uploadProfileImage(file)
    previewUrl.value = URL.createObjectURL(file)
    value.value = url
  } catch {
    setErrors('Upload failed. Please try again.')
  }
}

const onFileInputChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) await uploadAndSet(files[0])
}

const handleDrop = async (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files[0]) await uploadAndSet(e.dataTransfer.files[0])
}
const handleDragOver = () => {
  isDragOver.value = true
}
const handleDragLeave = () => {
  isDragOver.value = false
}

watch(value, (v) => {
  if (!v) previewUrl.value = null
})
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: start;
  align-items: start;
  gap: 2.5rem;
}

.preview-container {
  width: 5rem;
  height: 5rem;
}

.preview-group {
  display: flex;
  align-items: center;
  gap: 1.875rem;
}

.remove-button {
  display: flex;
  justify-content: center;
  align-items: end;
  background: none;
  gap: 0.4rem;
  color: var(--color-red-500);
  font-weight: 400;
  line-height: 1.125rem;
  width: fit-content;
  padding: 0 0.25rem 0.25rem 0.125rem;
  border-bottom: 1px solid var(--color-red-500);
  cursor: pointer;
}

.trash-icon {
  height: 1rem;
}

.file-input {
  display: none;
  width: 0px;
  height: 0px;
}

.file-dropzone {
  border: 2.5px dashed var(--color-slate-200);
  border-radius: 0.7rem;
  width: 100%;
  min-width: 16rem;
  padding: 1.875rem 2rem;
  background: white;
}

.file-dropzone:hover,
.file-dropzone.is-dragover {
  border: 2.5px dashed var(--color-slate-300);
  transition: border-color 0.2s;
  background: var(--color-slate-100);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.125rem;
  cursor: pointer;
}

.image-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-slate-400);
}

.instructions {
  color: var(--color-slate-400);
  font-size: var(--text-md);
}

.instructions a {
  color: var(--color-slate-500);
  font-weight: 500;
}

.instructions span {
  font-size: var(--text-sm);
}
</style>
