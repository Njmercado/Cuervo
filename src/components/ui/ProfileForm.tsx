import { useEffect, useState } from 'react'
import { type Profile as ProfileType } from '../../objects/profile'
import { FormInput } from './FormInput'
import { Box, Typography, Divider } from '@mui/material'
import { ProfileMedicalConditions } from './ProfileMedicalConditions'
import { ProfileSOSContacts } from './ProfileSOSContacts'

interface ProfileFormProps {
  profile: ProfileType
  onUpdate: (profile: ProfileType) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [form, setForm] = useState<ProfileType>(profile)

  useEffect(() => {
    setForm(profile)
  }, [profile])

  useEffect(() => {
    onUpdate(form)
  }, [form])

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
          value={form.profile_title || ''}
          onChange={(e) => setForm({ ...form, profile_title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
        />
        <FormInput
          label="Descripción Perfil"
          placeholder="Perfil Deportivo"
          value={form.profile_description || ''}
          onChange={(e) => setForm({ ...form, profile_description: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          textarea
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Personal Info */}
        <Box component="section" aria-label="Personal Information" mt={8}>
          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em', mt: 8 }}>INFORMACION DE SALUD</Typography>
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
              value={form?.insurance_name || ''}
              onChange={(e) => setForm({ ...form, insurance_name: e.target.value })}
              sx={{ gridArea: 'insurance' }}
            />
            <FormInput
              label="Numero Seguro (Opcional)"
              value={form?.insurance_number || ''}
              onChange={(e) => setForm({ ...form, insurance_number: e.target.value })}
              sx={{ gridArea: 'insurance-number' }}
            />
          </Box>
        </Box>

        <Box>
          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em', mt: 8 }}>CONDICIONES MEDICAS</Typography>
          <Divider sx={{ mt: 1 }} />
          <Box mt={3}>
            <ProfileMedicalConditions form={form} setForm={setForm} />
          </Box>
        </Box>

        {/* Emergency Info */}
        <Box mt={8} component="section" aria-label="Emergency Information">
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
            <ProfileSOSContacts form={form} setForm={setForm} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}