import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { SOSContactData } from '../objects/sosContact'
import toast from 'react-hot-toast'

export function useCreateSOSContact() {
  const { user } = useAuth()

  const createSOSContact = async (contact: SOSContactData) => {
    const { error } = await supabase.from('SOSContact').insert({
      name: contact.name,
      last_name: contact.last_name,
      phone_number: contact.phone_number,
      phone_indicative: contact.phone_indicative,
      location: contact.location,
      relationship: contact.relationship,
      user_id: user?.id,
    })

    if (error) {
      toast.error('Error al guardar el contacto')
      throw error
    }

    toast.success(`Contacto "${contact.name} ${contact.last_name}" guardado`)
  }

  return { createSOSContact }
}
