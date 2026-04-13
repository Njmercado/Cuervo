import { type Profile as ProfileType } from '../objects/profile'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useUpdateProfile() {
  const { user } = useAuth()

  const updateProfile = async (profile: ProfileType) => {
    const { error } = await supabase
      .from('Profile')
      .update({
        profile_description: profile.profile_description,
        profile_title: profile.profile_title,
        medical_conditions: profile.medical_conditions,
        sos_contacts: profile.sos_contacts,
        insurance_name: profile.insurance_name,
        insurance_number: profile.insurance_number,
        chosen: profile.chosen,
      })
      .eq('id', profile.id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    toast.success(`Perfil ${profile.profile_title} actualizado`)
  }

  return { updateProfile }
}