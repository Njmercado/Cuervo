import { supabase } from '../lib/supabase'
import type { Profile } from '../objects/profile'
import type { Condition } from '../objects/condition'
import type { SOSContact } from '../objects/sosContact'
import { useAuth } from '../contexts/AuthContext'

export interface ProfileDetails extends Profile {
  medical_conditions_data: Condition[]
  sos_contacts_data: SOSContact[]
}

export function useGetProfileDetails() {
  const { user } = useAuth()

  const getProfileDetails = async (id: string, isChosen: boolean = false): Promise<ProfileDetails | null> => {
    // 1. Fetch Profile
    let queryProfile = supabase
      .from('Profile')
      .select('*')
      .eq('user_id', user?.id)

    if (isChosen) {
      queryProfile = queryProfile.eq('chosen', true)
    } else {
      queryProfile = queryProfile.eq('id', id)
    }

    const { data: profile, error: profileError } = await queryProfile.single()

    if (profileError || !profile) {
      throw profileError || new Error('Profile not found')
    }

    // 2. Fetch matched Conditions (if any)
    let conditions: Condition[] = []
    if (profile.medical_conditions && profile.medical_conditions.length > 0) {
      const { data: condData, error: condError } = await supabase
        .from('MedicalCondition')
        .select('*')
        .in('id', profile.medical_conditions)
        .eq('user_id', user?.id)

      if (!condError && condData) {
        conditions = condData
      }
    }

    // 3. Fetch matched SOS Contacts (if any)
    let contacts: SOSContact[] = []
    if (profile.sos_contacts && profile.sos_contacts.length > 0) {
      const { data: contData, error: contError } = await supabase
        .from('SOSContact')
        .select('*')
        .in('id', profile.sos_contacts)
        .eq('user_id', user?.id)

      if (!contError && contData) {
        contacts = contData
      }
    }

    // 4. Combine and return
    return {
      ...profile,
      medical_conditions_data: conditions,
      sos_contacts_data: contacts
    } as ProfileDetails
  }

  return { getProfileDetails }
}
