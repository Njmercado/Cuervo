import { useEffect, useState } from 'react'
import { Box, Typography, IconButton, Card } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useGetSOSContacts } from '../../api'
import type { SOSContact } from '../../objects/sosContact'
import type { Profile } from '../../objects/profile'

interface ProfileSOSContactsProps {
  form: Profile
  setForm: (form: Profile) => void
}

interface LightSOSContactCardProps {
  key: string
  contact: SOSContact
  isChosen: boolean
  onSelect: (id: string) => void
  onDeselect: (id: string) => void
}

/**
 * Component to display and manage SOS contacts for a profile.
 * @param form The profile form containing the selected SOS contacts.
 * @param setForm Function to update the profile form.
 * @returns A React component.
 */
export function ProfileSOSContacts({ form, setForm }: ProfileSOSContactsProps) {
  const { getSOSContacts } = useGetSOSContacts()
  const [contacts, setContacts] = useState<SOSContact[]>([])

  useEffect(() => {
    async function fetchContacts() {
      try {
        const data = await getSOSContacts()
        if (data) setContacts(data)
      } catch (err) {
        console.error('Error fetching SOS contacts', err)
      }
    }
    fetchContacts()
  }, [])

  const selectedIds = form.sos_contacts || []

  const chosenContacts = contacts.filter(contact => selectedIds.includes(contact.id))
  const availableContacts = contacts.filter(contact => !selectedIds.includes(contact.id))

  const handleSelect = (id: string) => {
    setForm({
      ...form,
      sos_contacts: [...selectedIds, id]
    })
  }

  const handleDeselect = (id: string) => {
    setForm({
      ...form,
      sos_contacts: selectedIds.filter(val => val !== id)
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {chosenContacts.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
            SELECCIONADOS
          </Typography>
          {chosenContacts.map(contact => <LightSOSContactCard key={contact.id} contact={contact} isChosen={true} onSelect={handleSelect} onDeselect={handleDeselect} />)}
        </Box>
      )}

      {availableContacts.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
            {chosenContacts.length > 0 ? "OPCIONES DISPONIBLES" : "ELIGE TUS CONTACTOS"}
          </Typography>
          {availableContacts.map(contact => <LightSOSContactCard key={contact.id} contact={contact} isChosen={false} onSelect={handleSelect} onDeselect={handleDeselect} />)}
        </Box>
      )}

      {contacts.length === 0 && (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          No tienes contactos de emergencia registrados en tu cuenta.
        </Typography>
      )}
    </Box>
  )
}

/**
 * Component to display a lightweight SOS contact card to be chosen.
 * @param key 
 * @param contact contact general information
 * @param isChosen boolean to define if this contact is one of the chosen ones
 * @param onSelect function to select a contact
 * @param onDeselect function to deselect a contact
 * @returns A React component.
 */
function LightSOSContactCard({ key, contact, isChosen, onSelect, onDeselect }: LightSOSContactCardProps) {
  return (
    <Card
      key={key}
      sx={{
        bgcolor: theme => isChosen ? theme.palette.custom.tertiary[20] : theme.palette.background.default,
        border: theme => `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        mb: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, px: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight={600}>{contact.name} {contact.last_name}</Typography>
          <Typography variant="caption" color="text.secondary">{contact.relationship} • {contact.phone_indicative} {contact.phone_number}</Typography>
        </Box>
        <IconButton
          size="small"
          color={isChosen ? "error" : "primary"}
          onClick={() => isChosen ? onDeselect(contact.id) : onSelect(contact.id)}
        >
          {isChosen ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Card>
  )
}
