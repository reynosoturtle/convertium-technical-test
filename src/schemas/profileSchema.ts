import * as yup from 'yup';
import { SALUTATIONS, COUNTRIES, GENDERS, MARITAL_STATUSES, HOBBIES, SPORTS, MUSIC_GENRES, MOVIE_GENRES } from '@/types/constants';
import type { SectionDescriptor } from '@/types/formTypes';

export const profileSchema = yup.object({
  salutation: yup.string().oneOf(SALUTATIONS).required('Salutation is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  profileImage: yup.string().url().required('Image is required'),
  additionalInformation: yup
    .object({
      address: yup.string().required('Address is required'),
      country: yup.string().oneOf(COUNTRIES).required('Country is required'),
      postalCode: yup.string().required('Postal code is required'),
      dateOfBirth: yup
        .string()
        .required('Date of birth is required')
        .transform((value, original) => {
          if (typeof original === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(original)) {
            const [d, m, y] = original.split('/')
            return `${y.padStart(4,'0')}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
          }
          return value
        })
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
      gender: yup.string().oneOf(GENDERS).required('Gender is required'),
      maritalStatus: yup.string().oneOf(MARITAL_STATUSES).required('Marital status is required'),
    }),
  spouse: yup
    .object({
      salutation: yup.string().oneOf(SALUTATIONS).required(),
      firstName: yup.string().required(),
      lastName: yup.string().required()
    })
    .optional()
    .when('additionalInformation.maritalStatus', {
      is: (val: string) => val === 'Married',
      then: schema => schema,
      otherwise: schema => schema.strip(),
    }),
  preferences: yup
    .object({
      hobbies: yup.array().of(yup.string()),
      sports: yup.array().of(yup.string()),
      musicGenres: yup.array().of(yup.string()),
      movieGenres: yup.array().of(yup.string())
    })
    .optional()
});

export const profileFormSchema: SectionDescriptor[] = [
  {
    id: 'basic-information',
    key: 'basicInformation',
    title: 'Basic Information',
    description: 'Aliquip do nulla magna mollit reprehenderit dolore excepteur consectetur ea. In ipsum sunt et non esse nisi.',
    fields: [
      {
        component: 'FileUpload',
        label: 'Display Picture',
        props: {
          name: 'profileImage',
          mode: 'display'
        },
        attributes: {}
      },
      {
        component: 'SelectDropdown',
        label: 'Salutation',
        props: {
          name: 'salutation',
          options: SALUTATIONS,
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'First name',
        props: {
          name: 'firstName',
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'Last Name',
        props: {
          name: 'lastName',
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'Email Address',
        props: {
          name: 'email',
        },
        attributes: {}
      },
    ]
  },
  {
    id: 'additional-information',
    key: 'additionalInformation',
    title: 'Additional Information',
    description: 'Aliquip do nulla magna mollit reprehenderit dolore excepteur consectetur ea. In ipsum sunt et non esse nisi.',
    fields: [
      {
        component: 'TextInput',
        label: 'Address',
        props: {
          name: 'additionalInformation.address',
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'Country',
        props: {
          name: 'additionalInformation.country',
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'Postal Code',
        props: {
          name: 'additionalInformation.postalCode',
        },
        attributes: {}
      },
      {
        component: 'DatePicker',
        label: 'Date of Birth',
        props: {
          name: 'additionalInformation.dateOfBirth',
        },
        attributes: {}
      },
      {
        component: 'SelectDropdown',
        label: 'Gender',
        props: {
          name: 'additionalInformation.gender',
          options: GENDERS,
        },
        attributes: {}
      },
    ]
  },
  {
    id: 'spouse-details',
    key: 'spouse',
    title: 'Spouse Details',
    description: 'Aliquip do nulla magna mollit reprehenderit dolore excepteur consectetur ea. In ipsum sunt et non esse nisi.',
    fields: [
      {
        component: 'SelectDropdown',
        label: 'Salutation',
        props: {
          name: 'spouse.salutation',
          options: SALUTATIONS,
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'First Name',
        props: {
          name: 'spouse.firstName',
        },
        attributes: {}
      },
      {
        component: 'TextInput',
        label: 'Last Name',
        props: {
          name: 'spouse.lastName',
        },
        attributes: {}
      },
    ]
  },
  {
    id: 'preferences-preferences',
    key: 'preferences',
    title: 'Personal Preferences',
    description: 'Aliquip do nulla magna mollit reprehenderit dolore excepteur consectetur ea. In ipsum sunt et non esse nisi.',
    fields: [
      {
        component: 'MultiSelectDropdown',
        label: 'Hobbies',
        props: {
          name: 'preferences.hobbies',
          options: HOBBIES,
        },
        attributes: {}
      },
      {
        component: 'MultiSelectDropdown',
        label: 'Sports',
        props: {
          name: 'preferences.sports',
          options: SPORTS,
        },
        attributes: {}
      },
      {
        component: 'MultiSelectDropdown',
        label: 'Music Genres',
        props: {
          name: 'preferences.musicGenres',
          options: MUSIC_GENRES,
        },
        attributes: {}
      },
      {
        component: 'MultiSelectDropdown',
        label: 'Movie Genres',
        props: {
          name: 'preferences.movieGenres',
          options: MOVIE_GENRES,
        },
        attributes: {}
      },
    ]
  },
]