import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { type Profile as ProfileType } from '../objects/profile'
import toast from "react-hot-toast"

export function useCreateProfile() {
  const { user } = useAuth()

  const createProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('Profile').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      medical_conditions: profile.medical_conditions,
      sos_contacts: profile.sos_contacts,
      insurance_name: profile.insurance_name,
      insurance_number: profile.insurance_number,
      chosen: profile.chosen,
      user_id: user?.id,
    })

    if (error) {
      toast.error('Error saving profile')
      return
    }

    toast.success(`Perfil ${profile.profile_title} guardado`)
  }

  return { createProfile }
}