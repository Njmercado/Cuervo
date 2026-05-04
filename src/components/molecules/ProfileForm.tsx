
import { type Profile as ProfileType } from '../../objects/profile'
import { FormInput } from '../atoms'
import { Box, Typography, Divider } from '@mui/material'
import { ProfileMedicalConditions } from '../organisms'
import { ProfileSOSContacts } from '../organisms'

interface ProfileFormProps {
  profile: ProfileType
  onUpdate: (profile: ProfileType) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Meta Info */}
      <Box
        component="section"
        aria-label="Profile Metadata"
        sx={{
          bgcolor: (theme) => theme.palette.custom.neutral[70],
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <FormInput
          label="Titulo"
          placeholder="Perfil Deportivo"
          value={profile?.profile_title || ''}
          onChange={(value) => onUpdate({ ...profile, profile_title: value })}
          onClick={(e) => e.stopPropagation()}
        />
        <FormInput
          label="Descripción Perfil"
          placeholder="Perfil Deportivo"
          value={profile?.profile_description || ''}
          onChange={(value) => onUpdate({ ...profile, profile_description: value })}
          onClick={(e) => e.stopPropagation()}
          textarea
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Personal Info */}
        <Box component="section" aria-label="Personal Information" mt={2}>
          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em' }}>INFORMACION DE SALUD</Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{
            display: 'grid',
            gridTemplateAreas: {
              xs: `"insurance" "insurance-number" "extra-info"`,
              md: `"insurance insurance-number" "extra-info extra-info"`
            },
            gap: 3,
            mt: 3
          }}>
            <FormInput
              label="Seguro de Salud"
              value={profile?.insurance_name || ''}
              onChange={(value) => onUpdate({ ...profile, insurance_name: value })}
              sx={{ gridArea: 'insurance' }}
            />
            <FormInput
              label="Numero Seguro (Opcional)"
              value={profile?.insurance_number || ''}
              onChange={(value) => onUpdate({ ...profile, insurance_number: value })}
              sx={{ gridArea: 'insurance-number' }}
            />
          </Box>
        </Box>

        <Box>
          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em', mt: 2 }}>CONDICIONES MEDICAS</Typography>
          <Divider sx={{ mt: 1 }} />
          <Box mt={3}>
            <ProfileMedicalConditions form={profile} setForm={onUpdate} />
          </Box>
        </Box>

        {/* Emergency Info */}
        <Box mt={4} component="section" aria-label="Emergency Information">
          <Typography
            fontWeight={600}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'error.main',
            }}
          >
            Información de Emergencia
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box mt={3}>
            <ProfileSOSContacts form={profile} setForm={onUpdate} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}