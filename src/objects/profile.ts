export interface ProfileData {
  // Personal Info
  fullName?: string
  rh?: string
  idType?: string
  idNumber?: string
  healthInsurance?: string
  healthInsuranceNumber?: string
  extraInfo?: string

  // Emergency Info
  emergencyName?: string
  emergencyContact?: string
  emergencyRelationship?: string
}

export interface Profile {
  id?: string
  profile_title?: string
  profile_description?: string
  data?: ProfileData
  isExpanded?: boolean
  chosen?: boolean
}