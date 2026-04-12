export interface SOSContactData {
  name: string
  last_name: string
  phone_number: string
  phone_indicative: string
  location: string
  relationship: string
  user_id?: string
}

export interface SOSContact extends SOSContactData {
  id: string
  created_at?: string
}
