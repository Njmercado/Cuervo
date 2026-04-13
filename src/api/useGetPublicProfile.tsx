import { supabase } from "../lib/supabase"
import { type PublicProfileType } from "../objects/publicProfile"

export function useGetPublicProfile() {

  const getPublicProfile = async (token: string): Promise<PublicProfileType> => {
    const { data, error } = await supabase
      .from('PublicProfile')
      .select('*')
      .eq('user_id', token)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  return { getPublicProfile }
}