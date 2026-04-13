import { supabase } from '../lib/supabase'

export function useGetChosenProfile() {
  async function getChosen(token: string) {
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('user_id', token)
      .eq('chosen', true)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  return {
    getChosen
  }
}