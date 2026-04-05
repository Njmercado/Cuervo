import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

export function useGetProfiles() {
  const { user } = useAuth()

  const getProfiles = async () => {
    const { data, error } = await supabase.from('PublicUser').select('*').eq('user_id', user?.id)
    if (error) {
      throw error
    }
    return data
  }

  return { getProfiles }
}