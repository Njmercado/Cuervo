import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { SOSContact } from '../objects/sosContact'
import toast from 'react-hot-toast'

export function useUpdateSOSContact() {
  const { user } = useAuth()

  const updateSOSContact = async (contact: SOSContact) => {
    const { error } = await supabase
      .from('SOSContact')
      .update({
        name: contact.name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
        phone_indicative: contact.phone_indicative,
        location: contact.location,
        relationship: contact.relationship,
      })
      .eq('id', contact.id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error al actualizar el contacto')
      throw error
    }

    toast.success(`Contacto "${contact.name} ${contact.last_name}" actualizado`)
  }

  return { updateSOSContact }
}
