<template>
  <PageLayout>
    <div class="main">
      <div class="nav">
        <span class="nav-header">Sections</span>
        <ul>
          <li 
            v-for="tab in PROFILE_TABS"
            :key="tab"
            :class="tab === currentTab && 'is-active-tab'"
            @click="changeTab(tab)">
            {{ tab }}
          </li>
        </ul>
      </div>
      <div class="tab-content">
        <div class="tab-header card">
          <div class="">
            <h1 class="page-header">My Profile</h1>
            <span class="page-description">Aliquip do nulla magna mollit reprehenderit dolore excepteur consectetur ea. In ipsum sunt et non esse nisi.</span>
          </div>

        </div>
        <div class="btn-container-col">
          <template v-if="isEditing">
            <Button type="button" variant="neutral" @action="toggleIsEditing(false)">
              Cancel
            </Button>
            <Button type="button" variant="primary" @action="handleSubmit(onSubmit)()">
              <template #leadingIcon>
                <SaveIcon width="16" height="16" />
              </template>
              Save Changes
            </Button>
          </template>
          <Button v-else :disabled="isEditing" type="button"  variant="neutral" @action="toggleIsEditing(true)">
            <template #leadingIcon>
              <EditIcon />
            </template>
            Edit Profile
          </Button>
        </div>
        
        <template v-if="profile">
            <form @submit.prevent="handleSubmit(onSubmit)()" class="form">
              <div
                v-for="section in sections"
                :key="section.key"
                :id="section.id"
                class="divide-y card"
              >
                <div class="section-header">
                  <div class="info-col">
                    <h2 class="section-header">{{ section.title }}</h2>
                    <span class="section-description">{{ section.description }}</span>
                  </div>
                </div>

                <div
                  v-for="field in section.fields"
                  :key="field.props.name"
                  class=""
                >
                  <div class="info-row">
                    <span class="data-label">{{ field.label }}</span>
                    
                    <div class="data-display-container">
                    <template v-if="isEditing">
                      <component
                        :is="componentMap[field.component]"
                        v-bind="field.props as any" />
                      </template>
                      <template v-else>
                        <div v-if="field.component === 'FileUpload'" class="profile-image-container">
                          <ProfileImage mode="display" />
                        </div>
                        <span v-else class="data-display">{{ resolveDataDisplay(profile, field.props.name) }}</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="btn-container-col">
                <template v-if="isEditing">
                  <Button type="button" variant="neutral" @action="toggleIsEditing(false)">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    <template #leadingIcon>
                      <SaveIcon width="16" height="16" />
                    </template>
                    Save Changes
                  </Button>
                </template>
              </div>
            </form>
        </template>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, watch, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { useProfile } from '../composables/useProfile'
import { profileSchema, profileFormSchema } from '@/schemas/profileSchema'
import type { SectionDescriptor, ComponentKey } from '@/types/formTypes'
import { getAtPath } from '@/utils/formPath'
import PageLayout from '@/layouts/PageLayout.vue'
import Button from '../components/Button.vue'
import EditIcon from '../components/icons/EditIcon.vue'
import SaveIcon from '../components/icons/SaveIcon.vue'
import DatePicker from '../components/Form/DatePicker.vue'
import MultiSelectDropdown from '../components/Form/MultiSelectDropdown.vue'
import SelectDropdown from '../components/Form/SelectDropdown.vue'
import TextInput from '../components/Form/TextInput.vue'
import FileUpload from '../components/Form/FileUpload.vue'
import ProfileImage from '../components/ProfileImage.vue'
import { PROFILE_TABS } from '@/types/constants'
import type { UserProfile } from '@/types/profile'

const { profile, updateProfile } = useProfile()
const initialValues = computed(() => toRaw(profile.value!))
const { handleSubmit, resetForm, values, setFieldValue } = useForm<UserProfile>(
  initialValues.value,
  profileSchema
)
watch(
  () => values.value.additionalInformation.maritalStatus,
  (newStatus) => {
    if (newStatus !== 'Married') {
      values.value.spouse = { salutation: '', firstName: '', lastName: '' }
    }
  }
)

const componentMap = {
  DatePicker,
  MultiSelectDropdown,
  SelectDropdown,
  TextInput,
  FileUpload,
  ProfileImage,
}

const asyncComponentMap: Record<
  ComponentKey,
  ReturnType<typeof defineAsyncComponent>
> = Object.fromEntries(
  Object.entries(componentMap).map(([key, loader]) => [key, defineAsyncComponent(loader as any)])
) as any

const sections = profileFormSchema as SectionDescriptor[]

watch(
  () => initialValues.value,
  (vals) => resetForm(vals),
  { immediate: true }
)

const isMarried = computed(() => values.value.additionalInformation?.maritalStatus === 'Married')
watch(
  () => isMarried.value,
  (married) => {
    if (!married) {
      setFieldValue('spouse.salutation', '')
      setFieldValue('spouse.firstName', '')
      setFieldValue('spouse.lastName', '')
      resetForm()
    }
  }
)

const router = useRouter()
const isEditing = ref<boolean>(false)

function toggleIsEditing(flag = !isEditing.value) {
  isEditing.value = flag
}

const onSubmit = async (values: UserProfile) => {
  try {
    await updateProfile(values)
    isEditing.value = false
  } catch (error) {
    console.error(error)
  }
}

type ProfileTabs = (typeof PROFILE_TABS)[number]
const currentTab = ref<ProfileTabs>('Basic Details')

const changeTab = (tab: ProfileTabs): void => {
  currentTab.value = tab
  const hash = `#${tab.toLowerCase().split(' ').join('-')}`
  router.push({ hash })
}

const resolveDataDisplay = (object: Record<string, any>, path: string) => {
  const data = getAtPath(object, path)

  if (Array.isArray(data)) return data.join(', ')
  else return data
}
</script>

<style scoped>
.desc {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.main {
  min-height: 100vh;
  display: grid;
  padding: 2.5rem;
  gap: 1.5rem;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  background-color: oklch(92.9% 0.013 255.508);
}

.card {
  background-color: oklch(98.4% 0.003 247.858);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.nav {
  grid-column: span 2 / span 2;
}

.nav-header {
  font-size: var(--text-md);
  text-transform: uppercase;
  font-weight: 700;
  color: var(--color-indigo-700);
}

.nav ul {
  position: sticky;
  list-style: none;
  margin-top: 0.5rem;
  padding: 0rem;
  width: 100%;
  min-width: max-content;
}

.nav li {
  position: relative;
  font-size: 0.875rem;
  white-space: nowrap;
  line-height: 1.5rem;
  color: var(--color-slate-500);
  cursor: pointer;
}

.nav li.is-active-tab {
  color: var(--color-indigo-700);
}

.nav li:hover {
  color: var(--color-indigo-600);
}

.tab-content {
  grid-column: span 8 / span 8;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-header {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-body {
  padding: 2rem;
}

.profile-image-container {
  min-width: 5rem;
  min-height: 5rem;
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.125rem;
}

.form {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

.btn-container-col {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}

.info-row {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.info-col {
  padding: 2rem;
}

.section-header {
  display: flex;
  gap: 2.5rem;
  flex-direction: row;
  justify-content: space-between;
}

.data-label {
  flex: 2;
}

.data-display-container {
  flex: 5;
}

.data-display-container > * {
  max-width: 24rem;
}

.data-display {
  flex: 5;
}

/* Small Mobile */
@media (max-width: 480px) {
  .info-row {
    padding: 1.5rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .data-display-container > * {
    max-width: none;
  }
}

/* Tablet Portrait */
@media (max-width: 768px) {
  .main {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    padding: 2.5rem 1.5rem;
  }

  .nav {
    display: none;
  }
}
</style>
