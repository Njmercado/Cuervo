export interface LicenseData {
  license_id: string
  temporary_password: string
  is_activated: boolean
  user_email: string
  user_name: string
  user_last_name: string
}

export interface License extends LicenseData {
  id: string
  user_id: string | null
  created_at?: string
  updated_at?: string
  username: string
}
