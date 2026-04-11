import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function useGetMedicalConditions() {
  const { user } = useAuth()

  const getConditions = async () => {
    const { data, error } = await supabase
      .from('MedicalCondition')
      .select('*')
      .eq('user_id', user?.id)

    if (error) {
      throw error
    }

    return data
  }

  return { getConditions }
}
