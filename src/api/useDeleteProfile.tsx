import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"

export function useDeleteProfile() {
  const { user } = useAuth()

  const deleteProfile = async (id: string) => {
    const { error } = await supabase
      .from('PublicUser')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error deleting profile')
      throw new Error('Error deleting profile')
    }

    toast.success('Perfil eliminado')
  }

  return { deleteProfile }
}