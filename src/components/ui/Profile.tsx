import { useState, useEffect } from 'react'
import { ProfileForm } from './ProfileForm'
import { type Profile as ProfileType, type ProfileData as ProfileDataType } from '../../objects/profile'
import { Box, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'

interface ProfileProps {
  onSave: (profile: ProfileType) => void
  onUpdate: (profile: ProfileType) => void
  profile?: ProfileType
  onDelete?: (id: string) => void
}

export function Profile({ onUpdate, onSave, profile, onDelete }: ProfileProps) {
  const [localProfile, setLocalProfile] = useState<ProfileType>()

  useEffect(() => {
    setLocalProfile(profile)
  }, [profile]);

  const handleUpdate = (profile: ProfileType) => {
    setLocalProfile(profile)
  }

  const handleSave = () => {
    if (!localProfile) return

    if (localProfile?.id) {
      onUpdate(localProfile as ProfileType)
    } else {
      onSave(localProfile as ProfileDataType)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 3 }}>
      <ProfileForm
        profile={localProfile ?? {} as ProfileType}
        onUpdate={handleUpdate}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

        {
          localProfile?.id && (
            <Button
              onClick={() => onDelete?.(localProfile?.id || '')}
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
            localProfile?.id ? 'Actualizar perfil' : 'Crear perfil'
          }
        </Button>
      </Box>
    </Box>
  )
}