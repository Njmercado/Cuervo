import { supabase } from '../lib/supabase'
import { type Condition } from '../objects/condition'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export function useUpdateMedicalCondition() {
  const { user } = useAuth()

  const updateCondition = async (condition: Condition) => {
    const { error } = await supabase
      .from('MedicalCondition')
      .update({
        title: condition.title,
        medicines: condition.medicines,
      })
      .eq('id', condition.id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error al actualizar la condición')
      throw error
    }

    toast.success(`Condición "${condition.title}" actualizada`)
  }

  return { updateCondition }
}
