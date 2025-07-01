import {
  SALUTATIONS,
  COUNTRIES,
  GENDERS,
  MARITAL_STATUSES
} from './constants';

export type Salutation = typeof SALUTATIONS[number];
export type Country = typeof COUNTRIES[number];
export type Gender = typeof GENDERS[number];
export type MaritalStatus = typeof MARITAL_STATUSES[number];