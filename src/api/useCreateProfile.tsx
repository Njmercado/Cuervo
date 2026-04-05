import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { type Profile as ProfileType } from '../objects/profile'
import toast from "react-hot-toast"

export function useCreateProfile() {
  const { user } = useAuth()

  const createProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('PublicUser').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
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