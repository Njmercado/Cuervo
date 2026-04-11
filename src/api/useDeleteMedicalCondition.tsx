import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useDeleteMedicalCondition() {
  const { user } = useAuth()

  const deleteCondition = async (id: string) => {
    const { error } = await supabase
      .from('MedicalCondition')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error al eliminar la condición')
      throw error
    }

    toast.success('Condición eliminada')
  }

  return { deleteCondition }
}
