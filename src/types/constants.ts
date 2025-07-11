export const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] as const;
export type Salutaion = typeof SALUTATIONS[number]

export const COUNTRIES = [
  'Singapore', 'Malaysia', 'Indonesia', 'Thailand',
  'Philippines', 'Vietnam', 'Australia',
  'United States', 'United Kingdom', 'India',
  'Canada', 'Germany', 'France', 'Japan', 'China'
] as const;
export type Country = typeof COUNTRIES[number]

export const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const;
export type Gender = typeof GENDERS[number];

export const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'] as const;
export type MaritalStatus = typeof MARITAL_STATUSES[number];

export const HOBBIES = [
  'Reading', 'Traveling', 'Photography', 'Cooking',
  'Gardening', 'Drawing', 'Writing', 'Crafting'
] as const;
export type Hobby = typeof HOBBIES[number]

export const SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Swimming',
  'Running', 'Cycling', 'Yoga', 'Badminton'
] as const;
export type Sports = typeof SPORTS[number]

export const MUSIC_GENRES = [
  'Pop', 'Rock', 'Jazz', 'Classical',
  'Hip-hop', 'Electronic', 'Country', 'R&B'
] as const;
export type MusicGenres = typeof MUSIC_GENRES[number]

export const MOVIE_GENRES = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi',
  'Romance', 'Horror', 'Documentary', 'Animation'
] as const;
export type MovieGenres = typeof MOVIE_GENRES[number]

export const PROFILE_TABS = [
  'Basic Details',
  'Additional Details',
  'Spouse Details',
  'Personal Preferences',
] as const

export const PROFILE_DEFAULT_VALUES = {
  salutation: SALUTATIONS[0],
  firstName: '',
  lastName: '',
  email: '',
  profileImage: '',
  additionalInformation: {
    address: '',
    country: COUNTRIES[0],
    postalCode: '',
    dateOfBirth: '',
    gender: GENDERS[0],
    maritalStatus: MARITAL_STATUSES[0]
  },
  spouse: {
    salutation: SALUTATIONS[0],
    firstName: '',
    lastName: '',
  },
  preferences: {
    hobbies: [],
    sports: [],
    musicGenres: [],
    movieGenres: [],
  },
}