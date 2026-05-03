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

type RHType = keyof typeof RH

export interface UserData {
  name: string
  last_name: string
  full_name: string
  rh: RHType
  sex: string
  personal_phone_number: string
  personal_phone_indicative: string
  id_type: string
  id_number: string
  from: string
  living_in: string,
  devices?: string[],
  username: string
  code: number
  public_username?: string
}

export interface User extends UserData {
  id: string
  created_at: string
  user_id: string
}