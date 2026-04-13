import { useState, useEffect } from 'react'
import { ProfileForm } from './ProfileForm'
import { type Profile as ProfileType } from '../../objects/profile'
import { Box, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'

const EMPTY_PROFILE: ProfileType = {
  id: '',
  profile_title: '',
  profile_description: '',
  medical_conditions: [],
  sos_contacts: [],
  insurance_name: '',
  insurance_number: '',
  chosen: false,
}

interface ProfileProps {
  onSave: (profile: ProfileType) => void
  profile?: ProfileType
  onDelete?: (id: string) => void
}

export function Profile({ onSave, profile, onDelete }: ProfileProps) {
  const [localProfile, setLocalProfile] = useState<ProfileType>(profile || EMPTY_PROFILE)

  useEffect(() => {
    setLocalProfile(profile || EMPTY_PROFILE)
  }, [profile]);

  const onUpdate = (profile: ProfileType) => {
    setLocalProfile(profile)
  }

  const handleSave = () => {
    if (!localProfile) return
    onSave(localProfile)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: 16, py: 8 }}>
      <ProfileForm
        profile={localProfile}
        onUpdate={onUpdate}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

        {
          localProfile.id && (
            <Button
              onClick={() => onDelete?.(localProfile.id)}
              variant="contained"
              color="error"
              fullWidth
              size="large"
              startIcon={<DeleteIcon />}
              sx={{ py: 1.8 }}
            >
              Eliminar perfil
            </Button>
          )
        }
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ py: 1.8 }}
        >
          {
            localProfile.id ? 'Actualizar perfil' : 'Crear perfil'
          }
        </Button>
      </Box>
    </Box>
  )
}