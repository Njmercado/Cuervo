export interface User {
  name: string
  last_name: string
  full_name: string
  rh: string
  sex: string
  personal_phone_number: string
  personal_phone_indicative: string
}

export interface UserDTO extends User {
  id: string
  created_at: string
  user_id: string
}