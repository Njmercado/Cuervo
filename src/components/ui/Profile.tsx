import { useState, useEffect } from 'react'
import { ProfileForm } from './ProfileForm'
import { type Profile as ProfileType } from '../../objects/profile'
import { Box, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useAuth } from '../../contexts/AuthContext'

const EMPTY_PROFILE: ProfileType = {
  id: '',
  profile_title: '',
  profile_description: '',
  data: {
    fullName: '',
    rh: '',
    idType: '',
    idNumber: '',
    healthInsurance: '',
    healthInsuranceNumber: '',
    extraInfo: '',
    emergencyName: '',
    emergencyContact: '',
    emergencyRelationship: '',
  },
  chosen: false,
}

interface ProfileProps {
  onSave: (profile: ProfileType) => void
  profile?: ProfileType
}

export function Profile({ onSave, profile }: ProfileProps) {
  const { user } = useAuth()
  const [localProfile, setLocalProfile] = useState<ProfileType>(profile || EMPTY_PROFILE)

  useEffect(() => {
    setLocalProfile(profile || EMPTY_PROFILE)
  }, [user, profile]);

  const onUpdate = (profile: ProfileType) => {
    setLocalProfile(profile)
  }

  const handleSave = () => {
    if (!profile) return
    onSave(profile)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ProfileForm
        profile={localProfile}
        onUpdate={onUpdate}
      />
      <Button
        onClick={handleSave}
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<AddCircleOutlineIcon />}
        sx={{ py: 1.8 }}
      >
        Crear perfil
      </Button>
    </Box>
  )
}