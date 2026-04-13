import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"

export function useUpdateChosenStatus() {
  const { user } = useAuth()

  const updateChosenStatus = async (id: string, currentChosenProfileId?: string) => {

    const { error: errorUpdateCurrentChosenProfile } = await supabase
      .from('Profile')
      .update({ chosen: false })
      .eq('id', currentChosenProfileId)
      .eq('user_id', user?.id)

    if (errorUpdateCurrentChosenProfile) {
      toast.error('Error updating profile')
      return
    }

    const { error } = await supabase
      .from('Profile')
      .update({ chosen: true })
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    toast.success('Perfil actualizado')
  }

  return { updateChosenStatus }
}