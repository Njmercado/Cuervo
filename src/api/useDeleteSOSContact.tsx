import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useDeleteSOSContact() {
  const { user } = useAuth()

  const deleteSOSContact = async (id: string) => {
    const { error } = await supabase
      .from('SOSContact')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error al eliminar el contacto')
      throw error
    }

    toast.success('Contacto eliminado')
  }

  return { deleteSOSContact }
}
