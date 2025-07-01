// types/profile.ts

import type { Salutation, Country, Gender, MaritalStatus } from './options';

export interface SpouseDetails {
  salutation: Salutation;
  firstName: string;
  lastName: string;
}

export interface PersonalPreferences {
  hobbies: string[];
  sports: string[];
  musicGenres: string[];
  moviesOrShows: string[];
}

export interface UserProfile {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: Country;
  postalCode: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  spouse?: SpouseDetails;
  preferences?: PersonalPreferences;
}
