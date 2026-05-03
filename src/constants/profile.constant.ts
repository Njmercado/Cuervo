export const RH_LABEL = {
  "A+": "A Positivo",
  "A-": "A Negativo",
  "B+": "B Positivo",
  "B-": "B Negativo",
  "AB+": "A B Positivo",
  "AB-": "A B Negativo",
  "O+": "O Positivo",
  "O-": "O Negativo",
}

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