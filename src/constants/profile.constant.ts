export const RH = {
  ['O+']: 'O+',
  ['O-']: 'O-',
  ['A+']: 'A+',
  ['A-']: 'A-',
  ['B+']: 'B+',
  ['B-']: 'B-',
  ['AB+']: 'AB+',
  ['AB-']: 'AB-',
} as const;

export type RH = (typeof RH)[keyof typeof RH];

export const ID_TYPE = {
  CC: 'CC',
  TI: 'TI',
  CE: 'CE',
  PAS: 'PAS',
} as const;

export type ID_TYPE = (typeof ID_TYPE)[keyof typeof ID_TYPE];

export const INITIAL_PROFILE_DATA = {
  fullName: '',
  rh: '',
  idType: '',
  idNumber: '',
  healthInsurance: '',
  healthInsuranceNumber: '',
  extraInfo: '',
  emergencyName: '',
  emergencyContact: '',
  emergencyRelationship: ''
}