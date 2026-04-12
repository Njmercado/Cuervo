import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

export function useGetUser() {
  const { user } = useAuth()

  const getUser = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('user_id', user?.id)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  return {
    getUser
  }
}