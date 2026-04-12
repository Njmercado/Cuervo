import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { SOSContact } from '../objects/sosContact'

export interface SOSContactFilters {
  search?: string
  relationship?: string
}

export function useGetSOSContacts() {
  const { user } = useAuth()

  const getSOSContacts = async (filters?: SOSContactFilters): Promise<SOSContact[]> => {
    let query = supabase
      .from('SOSContact')
      .select('*')
      .eq('user_id', user?.id)

    if (filters?.search) {
      const term = `%${filters.search}%`
      query = query.or(`name.ilike.${term},last_name.ilike.${term},phone_number.ilike.${term}`)
    }

    if (filters?.relationship) {
      query = query.eq('relationship', filters.relationship)
    }

    const { data, error } = await query

    if (error) throw error
    return data as SOSContact[]
  }

  return { getSOSContacts }
}
