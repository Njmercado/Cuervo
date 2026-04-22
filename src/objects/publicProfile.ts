import { type ProfileData } from "./profile"
import { type SOSContactData } from "./sosContact"
import { type ConditionData } from "./condition"
import { type UserData } from "./user"

export type PublicProfileType =
  Omit<UserData, 'id' | 'email' | 'created_at' | 'updated_at'> &
  Omit<ProfileData, 'chosen' | 'medical_conditions' | 'sos_contacts'> &
  {
    medical_conditions: ConditionData[]
    sos_contacts: SOSContactData[]
    medical_devices?: string[]
    life_saving_directives?: string[]
  }