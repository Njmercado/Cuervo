import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface CreateUserData {
  user_id: string
  name: string
  last_name?: string
  full_name: string
}

export function useCreateUser() {
  const createUser = async (data: CreateUserData) => {
    const { error } = await supabase.from('User').insert({
      user_id: data.user_id,
      name: data.name,
      last_name: data.last_name,
      full_name: data.full_name,
    })

    if (error) {
      toast.error('Error al guardar la información del usuario')
      throw error
    }
    
    // Sucess toast is handled in the SignUp component since it's a multi-step process
  }

  return { createUser }
}
