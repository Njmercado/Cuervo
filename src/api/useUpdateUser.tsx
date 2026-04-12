import type { UserDTO } from "../objects/user"
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useUpdateUser() {
  const { user: authUser } = useAuth()

  const updateUser = async (user: UserDTO) => {
    console.log(user)
    const { error } = await supabase
      .from('User')
      .update({
        name: user.name,
        last_name: user.last_name,
        full_name: `${user.name} ${user.last_name}`,
        rh: user.rh,
        sex: user.sex,
        personal_phone_number: user.personal_phone_number,
        personal_phone_indicative: user.personal_phone_indicative,
      })
      .eq('user_id', authUser?.id)
      .eq('id', user.id)

    if (error) {
      toast.error('Error al actualizar el usuario')
      throw error
    }

    toast.success('Usuario actualizado correctamente')
  }

  return { updateUser }
}