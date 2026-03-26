import { useEffect, useReducer } from 'react'
import { type Profile as ProfileType, type ProfileData } from '../../objects/profile'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { RH, ID_TYPE } from '../../constants/profile.constant'
import { Box, Typography, alpha, Divider } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type ProfileAction =
  | { type: 'UPDATE_PROFILE_META'; payload: { id?: string; field: 'profile_title' | 'profile_description'; value: string }; index?: number }
  | { type: 'UPDATE_PROFILE_DATA'; payload: { id?: string; data: Partial<ProfileData> }; index?: number }
  | { type: 'UPDATE'; payload: ProfileType }

const reducer = (state: ProfileType, action: ProfileAction): ProfileType => {
  switch (action.type) {
    case 'UPDATE_PROFILE_META':
      return { ...state, [action.payload.field]: action.payload.value }
    case 'UPDATE_PROFILE_DATA':
      return { ...state, data: { ...state.data, ...action.payload.data } }
    case 'UPDATE':
      return action.payload
    default:
      return state
  }
}

interface ProfileFormProps {
  profile: ProfileType
  onUpdate: (profile: ProfileType) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [state, dispatch] = useReducer(reducer, profile)
  const theme = useTheme();

  const rhOptions = Object.values(RH)
  const idTypeOptions = Object.values(ID_TYPE)

  useEffect(() => {
    onUpdate(state)
  }, [state])

  const handleSelectChange = (field: keyof ProfileData) => (e: SelectChangeEvent<string>) => {
    dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { [field]: e.target.value } } })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Meta Info */}
      <Box
        component="section"
        aria-label="Profile Metadata"
        sx={{
          bgcolor: (theme) => theme.palette.custom.glassBg,
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
          value={state.profile_title || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_title', value: e.target.value } })}
          onClick={(e) => e.stopPropagation()}
        />
        <FormInput
          label="Descripción Perfil"
          placeholder="Perfil Deportivo"
          value={state.profile_description || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_description', value: e.target.value } })}
          onClick={(e) => e.stopPropagation()}
          textarea
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Personal Info */}
        <Box component="section" aria-label="Personal Information" mt={8}>
          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em' }}>
            INFORMACION PERSONAL
          </Typography>
          <Divider sx={{ mt: 1 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
            <FormInput
              label="Nombre Completo"
              value={state.data?.fullName || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { fullName: e.target.value } } })}
            />
            <FormSelect
              label="RH"
              options={rhOptions}
              value={state.data?.rh || ''}
              onChange={handleSelectChange('rh')}
              placeholder="Seleccionar RH"
            />
            <FormSelect
              label="Tipo de Documento"
              options={idTypeOptions}
              value={state.data?.idType || ''}
              onChange={handleSelectChange('idType')}
              placeholder="Seleccionar Tipo"
            />
            <FormInput
              label="Documento de Identidad"
              value={state.data?.idNumber || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { idNumber: e.target.value } } })}
            />
          </Box>

          <Typography fontWeight={600} sx={{ letterSpacing: '0.1em', mt: 8 }}>
            INFORMACION DE SALUD
          </Typography>
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
              value={state.data?.healthInsurance || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsurance: e.target.value } } })}
              sx={{ gridArea: 'insurance' }}
            />
            <FormInput
              label="Numero Seguro (Opcional)"
              value={state.data?.healthInsuranceNumber || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsuranceNumber: e.target.value } } })}
              sx={{ gridArea: 'insurance-number' }}
            />
            <FormInput
              label="Información Extra"
              placeholder='Informacion Extra'
              value={state.data?.extraInfo || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { extraInfo: e.target.value } } })}
              textarea
              sx={{ gridArea: 'extra-info' }}
            />
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
          <Box
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.05),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.15),
              },
              transition: 'background-color 0.3s ease',
              border: '1px solid',
              borderColor: theme.palette.custom.errorBorder,
              borderRadius: 2,
              p: 3,
              mt: 3,
            }}
          >
            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <FormInput
                label="Nombre Completo"
                placeholder="Pedro Perez"
                value={state.data?.emergencyName || ''}
                onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyName: e.target.value } } })}
              />
              {/* TODO: Add phone nacionality */}
              <FormInput
                label="Numero de Contacto"
                placeholder="+57 300 000 0000"
                type="tel"
                value={state.data?.emergencyContact || ''}
                onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyContact: e.target.value } } })}
              />
              <FormInput
                placeholder="Hermano"
                label="Parentesco"
                value={state.data?.emergencyRelationship || ''}
                onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyRelationship: e.target.value } } })}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}