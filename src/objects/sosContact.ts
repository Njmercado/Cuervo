export interface SOSContactData {
  name: string
  last_name: string
  phone_number: string
  phone_indicative: string
  location: string
  relationship: string
}

export interface SOSContact extends SOSContactData {
  id: string
  user_id?: string
  created_at?: string
}
