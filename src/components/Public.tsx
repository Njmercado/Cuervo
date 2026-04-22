import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, useTheme, Avatar, Chip, Divider } from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded'
import { useGetPublicProfileQuery } from '../store/endpoints/profilesApi'
import { playProfileAudio, stopProfileAudio } from '../utils/audioTTS'

const MedicalSection = ({ title, icon, bgColor, color, children, shadowColor, theme }: any) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{
      backgroundColor: bgColor, color: color, borderRadius: theme.customSizes?.radius?.xl,
      display: 'flex', flexDirection: 'column', p: 3,
      boxShadow: `0 4px 12px ${shadowColor}`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </Box>
    </Box>
  </Box>
)

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place'

export function Public() {
  const { token } = useParams()
  const theme = useTheme()
  const { data: profile, isLoading, isError, isFetching } = useGetPublicProfileQuery(token as string, { skip: !token })
  const [location, setLocation] = useState<string>('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const loading = isLoading || isFetching
  const error = isError || !token

  useEffect(() => {
    return () => stopProfileAudio()
  }, [])

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const url = `${GOOGLE_MAPS_URL}/${position.coords.latitude},${position.coords.longitude}`
      setLocation(url)
    })
  }

  const sendLocationToEmergencyContacts = () => {
    window.open(location, '_blank')
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          width: 60, height: 60, borderRadius: '50%', backgroundColor: theme.palette.custom?.primary?.[10],
          display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s infinite'
        }}>
          <MonitorHeartRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
        </Box>
        <Typography sx={{ mt: 3, fontWeight: 800, color: 'text.disabled', letterSpacing: '0.15em', fontSize: theme.customSizes?.font?.small }}>
          CARGANDO PERFIL...
        </Typography>
      </Box>
    )
  }

  if (error || !profile) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ p: 4, borderRadius: 4, textAlign: 'center', maxWidth: 400, width: '100%', border: `1px solid ${theme.palette.divider}`, backgroundColor: 'white' }}>
          <Typography variant="h2" fontWeight={900} sx={{ color: 'text.disabled' }}>404</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>El perfil no existe o es privado.</Typography>
        </Box>
      </Box>
    )
  }

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopProfileAudio()
      setIsPlayingAudio(false)
    } else {
      const started = playProfileAudio(profile)
      if (started) setIsPlayingAudio(true)
      setTimeout(() => {
        setIsPlayingAudio(false)
      }, 15000)
    }
  }

  const allergies = profile.medical_conditions?.filter(c => c.is_allergy) || []
  const conditions = profile.medical_conditions?.filter(c => !c.is_allergy) || []
  const medicalDevices = profile.medical_devices || []
  const lifeSavingDirectives = profile.life_saving_directives || []
  const hasContextChips = profile.sex || profile.from || profile.living_in

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      pb: 8,
      fontFamily: theme.typography.fontFamily
    }}>
      {/* Header Banner */}
      <Box sx={{
        backgroundColor: theme.palette.error.main, color: 'white', py: 2, px: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: `0 2px 10px rgba(0,0,0,0.2)`
      }}>
        <MonitorHeartRoundedIcon fontSize="small" />
        <Typography sx={{ fontWeight: 900, fontSize: theme.customSizes?.font?.small || '0.75rem', letterSpacing: '0.05em' }}>
          PERFIL DE EMERGENCIA
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 480, mx: 'auto', p: 2, pt: 4 }}>

        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, textAlign: 'center' }}>
          <Avatar sx={{
            width: 96, height: 96, mb: 1,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontSize: '2.5rem', fontWeight: 900,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {profile.name?.[0]}{profile.last_name?.[0]}
          </Avatar>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.h3 || '1.75rem', fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', lineHeight: 1.1 }}>
              {profile.name} {profile.last_name}
            </Typography>
            <Box sx={{
              backgroundColor: theme.palette.custom?.secondary?.[100],
              color: 'white', borderRadius: 1,
              px: 1, py: 1, display: 'inline-flex', alignItems: 'center', gap: 1,
              boxShadow: '0 2px 4px rgba(0,200,83,0.3)'
            }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>RH</Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1 }}>
                {profile.rh || 'N/A'}
              </Typography>
            </Box>
          </Box>

          {profile.id_type && profile.id_number && (
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'text.secondary', }}>
              {profile.id_type}: {profile.id_number}
            </Typography>
          )}
        </Box>

        {/* Context Chips */}
        {hasContextChips && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
            {profile.sex && (
              <Chip label={`${profile.sex}`} size="small" sx={{ backgroundColor: theme.palette.grey[200], border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
            {profile.from && (
              <Chip label={`De: ${profile.from}`} size="small" sx={{ backgroundColor: theme.palette.grey[200], border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
            {profile.living_in && (
              <Chip label={`Reside: ${profile.living_in}`} size="small" sx={{ backgroundColor: theme.palette.grey[200], border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
          </Box>
        )}

        {/* Context Message */}
        {profile.profile_description && (
          <Box sx={{ mb: 4, px: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.base, color: 'text.primary', fontStyle: 'italic', lineHeight: 1, fontWeight: 500 }}>
              "{profile.profile_description}"
            </Typography>
          </Box>
        )}

        {/* Audio Feature */}
        <Button
          onClick={handleAudioToggle}
          fullWidth
          sx={{
            mb: 4, minHeight: 48,
            backgroundColor: isPlayingAudio ? theme.palette.error.main : theme.palette.custom?.primary?.[10],
            color: isPlayingAudio ? 'white' : theme.palette.primary.main,
            borderRadius: theme.customSizes?.radius?.pill, px: 3, py: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            boxShadow: 'none', '&:hover': { boxShadow: 'none' }
          }}
        >
          {isPlayingAudio ? <StopRoundedIcon /> : <VolumeUpRoundedIcon />}
          <Typography sx={{ fontWeight: 800, fontSize: theme.customSizes?.font?.small || '0.875rem', letterSpacing: '0.05em' }}>
            {isPlayingAudio ? 'DETENER AUDIO' : 'ESCUCHAR PERFIL EXPLICADO'}
          </Typography>
        </Button>

        {/* High-Alert Section (Allergies) */}
        {allergies.length > 0 && (
          <MedicalSection
            title="ALERGIAS CRÍTICAS"
            icon={<WarningAmberRoundedIcon sx={{ fontSize: 24 }} />}
            bgColor={theme.palette.error.main}
            color="white"
            shadowColor={theme.palette.custom?.tertiary?.[20]}
            theme={theme}
          >
            {allergies.map((allergy, i) => (
              <Box key={i} sx={{ mb: i < allergies.length - 1 ? 2 : 0 }}>
                <Typography sx={{ fontSize: theme.customSizes?.font?.xl || '1.5rem', fontWeight: 900, lineHeight: 1.2 }}>
                  {allergy.title.toUpperCase()}
                </Typography>
                {allergy.medicines && allergy.medicines.length > 0 && (
                  <Box sx={{ mt: 1, p: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 700, opacity: 0.9 }}>
                      MEDICAMENTOS CRÍTICOS:
                    </Typography>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.base, fontWeight: 900, mt: 0.5 }}>
                      {allergy.medicines.join(', ').toUpperCase()}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </MedicalSection>
        )}

        {/* Medical Conditions & Devices */}
        {(conditions.length > 0 || medicalDevices.length > 0) && (
          <MedicalSection
            title="CONDICIONES Y DISPOSITIVOS"
            icon={<LocalHospitalRoundedIcon sx={{ fontSize: 24 }} />}
            bgColor={theme.palette.warning.light}
            color="rgba(0,0,0,0.87)"
            shadowColor="rgba(255, 152, 0, 0.2)"
            theme={theme}
          >
            {conditions.map((cond, i) => (
              <Box key={`cond-${i}`} sx={{ mb: i < conditions.length - 1 ? 1 : 0 }}>
                <Typography sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, lineHeight: 1.2 }}>
                  {cond.title.toUpperCase()}
                </Typography>
                {cond.medicines && cond.medicines.length > 0 && (
                  <Typography sx={{ fontSize: theme.customSizes?.font?.base, fontWeight: 700, mt: 0.5 }}>
                    MEDICACIÓN: {cond.medicines.join(', ').toUpperCase()}
                  </Typography>
                )}
              </Box>
            ))}

            {medicalDevices.length > 0 && (
              <Box sx={{ mt: conditions.length > 0 ? 1 : 0, pt: conditions.length > 0 ? 2 : 0, borderTop: conditions.length > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                <Typography sx={{ fontSize: theme.customSizes?.font?.small || '0.875rem', fontWeight: 700, opacity: 0.8, mb: 0.5 }}>
                  DISPOSITIVOS MÉDICOS:
                </Typography>
                {medicalDevices.map((dev, i) => (
                  <Typography key={`dev-${i}`} sx={{ fontSize: theme.customSizes?.font?.lg || '1.25rem', fontWeight: 900, lineHeight: 1.2 }}>
                    {dev.toUpperCase()}
                  </Typography>
                ))}
              </Box>
            )}
          </MedicalSection>
        )}

        {/* Life Saving Directives */}
        {lifeSavingDirectives.length > 0 && (
          <MedicalSection
            title="DIRECTIVAS MÉDICAS"
            icon={<AccessibilityNewRoundedIcon sx={{ fontSize: 24 }} />}
            bgColor="#e0f7fa" // TODO: Add color's names for these in App.tsx
            color="#006064"
            theme={theme}
          >
            {lifeSavingDirectives.map((directive, i) => (
              <Typography key={`dir-${i}`} sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, lineHeight: 1 }}>
                {directive.toUpperCase()}
              </Typography>
            ))}
          </MedicalSection>
        )}

        {/* Emergency Contacts List ABOVE Admin Info */}
        {profile.sos_contacts && profile.sos_contacts.length > 0 && (
          <MedicalSection
            title="CONTACTOS DE EMERGENCIA"
            icon={<PhoneRoundedIcon sx={{ fontSize: 24 }} />}
            bgColor="white"
            color="rgba(0,0,0,0.87)"
            shadowColor="rgba(0,0,0,0.05)"
            theme={theme}
          >
            {profile.sos_contacts.map((contact, i) => (
              <Box key={i}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1 }}>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
                      {contact.name} {contact.last_name || ''}
                    </Typography>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                      ({contact.relationship})
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    href={`tel:${contact.phone_indicative || ''}${contact.phone_number}`}
                    onClick={sendLocationToEmergencyContacts}
                    fullWidth
                    sx={{
                      mt: 1,
                      backgroundColor: theme.palette.success.main,
                      color: 'white',
                      borderRadius: theme.customSizes?.radius?.lg,
                      fontSize: theme.customSizes?.font?.base,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)',
                      gap: 1,
                    }}
                  >
                    <PhoneRoundedIcon sx={{ fontSize: 24 }} />
                    <span>CONTACTAR</span>
                  </Button>
                </Box>

                {i < profile.sos_contacts!.length - 1 && (
                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.15)' }} />
                )}
              </Box>
            ))}
          </MedicalSection>
        )}

        {/* Administrative Details */}
        {(profile.insurance_name || profile.insurance_number) && (
          <MedicalSection
            title="INFORMACIÓN ADMINISTRATIVA"
            icon={<VerifiedUserRoundedIcon sx={{ fontSize: 24 }} />}
            bgColor={theme.palette.grey[100]}
            color="rgba(0,0,0,0.87)"
            theme={theme}
          >
            <Box>
              <Typography sx={{ fontSize: theme.customSizes?.font?.small || '0.875rem', fontWeight: 700, color: 'text.secondary', opacity: 0.8 }}>
                EPS VIGENTE
              </Typography>
              <Typography sx={{ fontSize: theme.customSizes?.font?.lg || '1.25rem', fontWeight: 900 }}>
                {profile.insurance_name?.toUpperCase() || 'NINGUNA'}
              </Typography>
            </Box>
            {profile.insurance_number && (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: theme.customSizes?.font?.small || '0.875rem', fontWeight: 700, color: 'text.secondary', opacity: 0.8 }}>
                  PÓLIZA / IDENTIFICACIÓN
                </Typography>
                <Typography sx={{ fontSize: theme.customSizes?.font?.lg || '1.25rem', fontWeight: 900 }}>
                  {profile.insurance_number.toUpperCase()}
                </Typography>
              </Box>
            )}
          </MedicalSection>
        )}

      </Box>
    </Box>
  )
}