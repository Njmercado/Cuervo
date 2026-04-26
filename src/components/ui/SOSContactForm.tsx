import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import type { SOSContact, SOSContactData } from '../../objects/sosContact'
import { RELATIONSHIP_OPTIONS } from '../../constants'

const INITIAL_FORM: SOSContactData = {
  name: '',
  last_name: '',
  phone_number: '',
  phone_indicative: '',
  location: '',
  relationship: '',
}

export interface SOSContactFormProps {
  contact?: SOSContact
  onSave: (data: SOSContactData | SOSContact) => void
  onCancel: () => void
}

export function SOSContactForm({ contact, onSave, onCancel }: SOSContactFormProps) {
  const [formData, setFormData] = useState<SOSContactData>(INITIAL_FORM)

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
        phone_indicative: contact.phone_indicative,
        location: contact.location,
        relationship: contact.relationship,
      })
    } else {
      setFormData(INITIAL_FORM)
    }
  }, [contact])

  const handleChange = (field: keyof SOSContactData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contact?.id) {
      onSave({ ...contact, ...formData })
    } else {
      onSave(formData)
    }
  }

  const isValid = formData.name.trim().length > 0 && formData.last_name.trim().length > 0 && formData.phone_number.trim().length > 0

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <FormInput
        label="Nombre"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        placeholder="Ej: María"
      />
      <FormInput
        label="Apellido"
        value={formData.last_name}
        onChange={(value) => handleChange('last_name', value)}
        placeholder="Ej: García"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormInput
          label="Indicativo"
          value={formData.phone_indicative}
          onChange={(value) => handleChange('phone_indicative', value)}
          placeholder="+57"
          sx={{ maxWidth: 110 }}
        />
        <FormInput
          label="Teléfono"
          value={formData.phone_number}
          onChange={(value) => handleChange('phone_number', value)}
          placeholder="3001234567"
        />
      </Box>
      <FormInput
        label="Ubicación"
        value={formData.location}
        onChange={(value) => handleChange('location', value)}
        placeholder="Ej: Bogotá, Colombia"
      />
      <FormSelect
        label="Relación"
        value={formData.relationship}
        onChange={(e) => handleChange('relationship', e.target.value)}
        options={RELATIONSHIP_OPTIONS}
      />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={!isValid}>
          {contact?.id ? 'Actualizar' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  )
}
