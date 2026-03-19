import { useEffect, useReducer } from 'react'
import { type Profile as ProfileType, type ProfileData } from '../../objects/profile'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { RH, ID_TYPE } from '../../constants/profile.constant'
import { Box, Typography, TextField } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

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
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          bgcolor: 'rgba(255,255,255,0.04)',
          p: 3,
          borderRadius: 2,
        }}
      >
        <FormInput
          label="Profile Title"
          placeholder="Example 1"
          value={state.profile_title || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_title', value: e.target.value } })}
          onClick={(e) => e.stopPropagation()}
        />
        <FormInput
          label="Description"
          placeholder="Profile Description"
          value={state.profile_description || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_description', value: e.target.value } })}
          onClick={(e) => e.stopPropagation()}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Personal Info */}
        <Box component="section" aria-label="Personal Information">
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'text.secondary',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1,
              mb: 3,
            }}
          >
            Información Personal
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
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
            <FormInput
              label="Seguro de Salud"
              value={state.data?.healthInsurance || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsurance: e.target.value } } })}
            />
            <FormInput
              label="Numero Seguro (Opcional)"
              value={state.data?.healthInsuranceNumber || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsuranceNumber: e.target.value } } })}
            />
          </Box>

          {/* Extra Info */}
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Información Extra"
              value={state.data?.extraInfo || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { extraInfo: e.target.value } } })}
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
                },
              }}
            />
          </Box>
        </Box>

        {/* Emergency Info */}
        <Box
          component="section"
          aria-label="Emergency Information"
          sx={{
            bgcolor: 'rgba(211, 47, 47, 0.05)',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.1)',
            },
            transition: 'background-color 0.3s ease',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            borderRadius: 2,
            p: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'error.main',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1,
              mb: 3,
            }}
          >
            Información de Emergencia
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <FormInput
              label="Nombre Completo"
              value={state.data?.emergencyName || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyName: e.target.value } } })}
            />
            <FormInput
              label="Numero de Contacto"
              type="tel"
              value={state.data?.emergencyContact || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyContact: e.target.value } } })}
            />
            <FormInput
              label="Parentesco"
              value={state.data?.emergencyRelationship || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyRelationship: e.target.value } } })}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}