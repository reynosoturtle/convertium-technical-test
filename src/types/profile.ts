import type { Salutation, Country, Gender, MaritalStatus } from './options';

export interface AdditionalInfomation {
  address: string;
  country: Country;
  postalCode: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
}
export interface SpouseDetails {
  salutation: Salutation;
  firstName: string;
  lastName: string;
}

export interface PersonalPreferences {
  hobbies: string[];
  sports: string[];
  musicGenres: string[];
  movieGenres: string[];
} 
export interface UserProfile {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  additionalInformation: AdditionalInfomation;
  spouse: SpouseDetails;
  preferences: PersonalPreferences;
}
