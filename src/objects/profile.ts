export interface ProfileData {
  profile_title: string
  profile_description: string
  chosen: boolean
  medical_conditions: string[] // list of int8 ids
  sos_contacts: string[] // list of int8 ids
  insurance_name: string
  insurance_number: string
}

export interface Profile extends ProfileData {
  id: string
  created_at?: string
  updated_at?: string
  user_id?: string
}