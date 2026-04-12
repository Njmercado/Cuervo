import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { type ConditionData } from '../objects/condition'
import toast from 'react-hot-toast'

export function useCreateMedicalCondition() {
  const { user } = useAuth()

  const createCondition = async (condition: ConditionData) => {
    const { error } = await supabase.from('MedicalCondition').insert({
      title: condition.title,
      medicines: condition.medicines,
      user_id: user?.id,
    })

    if (error) {
      toast.error('Error al guardar la condición')
      throw error
    }

    toast.success(`Condición "${condition.title}" guardada`)
  }

  return { createCondition }
}
