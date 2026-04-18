import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Typography, Chip, Card, Button, useTheme } from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import { useGetPublicProfileQuery } from '../store/endpoints/profilesApi'

import { playProfileAudio, stopProfileAudio } from '../utils/audioTTS'

export function Public() {
  const { token } = useParams()
  const theme = useTheme()
  const { data: profile, isLoading, isError, isFetching } = useGetPublicProfileQuery(token as string, { skip: !token })
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const loading = isLoading || isFetching
  const error = isError || !token

  // Stop audio parsing when unmounting to prevent ghost audio reading
  useEffect(() => {
    return () => stopProfileAudio()
  }, [])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          width: 60, height: 60, borderRadius: theme.customSizes?.radius?.circle || '50%', bgcolor: theme.palette.custom?.primary?.[10] || 'rgba(0,110,42,0.1)',
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
      <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ p: 4, borderRadius: 4, textAlign: 'center', maxWidth: 400, width: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h2" fontWeight={900} sx={{ color: 'text.disabled' }}>404</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>El perfil no existe o es privado.</Typography>
        </Card>
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

      // Let button visually reset after a generous timeout relative to speech length
      // Actual native completion event routing is complex across Safari/Chrome, timeout fallback is safer UX
      setTimeout(() => {
        setIsPlayingAudio(false)
      }, 15000)
    }
  }

  const allergies = profile.medical_conditions?.filter(c => c.is_allergy) || []
  const conditions = profile.medical_conditions?.filter(c => !c.is_allergy) || []
  const primaryContact = profile.sos_contacts?.[0]

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      pb: primaryContact ? 14 : 4,
      fontFamily: theme.typography.fontFamily
    }}>

      {/* Header Banner */}
      <Box sx={{
        bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, py: 2, px: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: `0 2px 10px ${theme.palette.custom?.primary?.[20] || 'rgba(0,0,0,0.2)'}`
      }}>
        <MonitorHeartRoundedIcon fontSize="small" />
        <Typography sx={{ fontWeight: 900, fontSize: theme.customSizes?.font?.small, letterSpacing: '0.05em' }}>
          INFORMACIÓN MÉDICA DE EMERGENCIA
        </Typography>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ maxWidth: 480, mx: 'auto', p: 2, pt: 4 }}>

        {/* Identity & Audio Play Feature */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>

          {/* Audio TTS Button Action */}
          <Button
            onClick={handleAudioToggle}
            sx={{
              margin: '0 auto', mb: 2,
              bgcolor: isPlayingAudio ? theme.palette.error.main : theme.palette.custom?.primary?.[10] || '#e8f5e9',
              color: isPlayingAudio ? 'white' : theme.palette.primary.main,
              borderRadius: theme.customSizes?.radius?.pill || '9999px', px: 3, py: 1,
              display: 'flex', alignItems: 'center', gap: 1,
              boxShadow: 'none', '&:hover': { boxShadow: 'none' }
            }}
          >
            {isPlayingAudio ? <StopRoundedIcon /> : <VolumeUpRoundedIcon />}
            <Typography sx={{ fontWeight: 800, fontSize: theme.customSizes?.font?.small, letterSpacing: '0.05em' }}>
              {isPlayingAudio ? 'DETENER AUDIO' : 'ESCUCHAR PERFIL EXPLICADO'}
            </Typography>
          </Button>

          <Typography sx={{ fontSize: theme.customSizes?.font?.tiny, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1 }}>
            Identidad Nacional
          </Typography>

          <Typography sx={{ fontSize: theme.customSizes?.font?.h3, fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', lineHeight: 1, mb: 2, letterSpacing: '-0.02em' }}>
            {profile.name} {profile.last_name}
          </Typography>

          {profile.id_type && profile.id_number && (
            <Chip
              label={`${profile.id_type}: ${profile.id_number}`}
              sx={{ bgcolor: theme.palette.custom?.neutral?.[100], color: 'text.primary', fontWeight: 800, fontSize: theme.customSizes?.font?.small, px: 1, letterSpacing: '0.05em', height: 28 }}
            />
          )}

          {/* Demographics Area */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, px: 2 }}>
            {profile.sex && (
              <Chip label={`Sexo: ${profile.sex}`} size="small" sx={{ bgcolor: 'white', border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
            {profile.from && (
              <Chip label={`De: ${profile.from}`} size="small" sx={{ bgcolor: 'white', border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
            {profile.living_in && (
              <Chip label={`Reside en: ${profile.living_in}`} size="small" sx={{ bgcolor: 'white', border: `1px solid ${theme.palette.divider}`, fontSize: theme.customSizes?.font?.tiny, fontWeight: 700, color: 'text.secondary' }} />
            )}
          </Box>

          {profile.profile_description && (
            <Typography sx={{ mt: 3, fontSize: theme.customSizes?.font?.base, color: 'text.primary', fontStyle: 'italic', px: 3, lineHeight: 2, fontWeight: 500 }}>
              "{profile.profile_description}"
            </Typography>
          )}
        </Box>

        {/* Primary Tiles (RH & Allergies) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: allergies.length > 0 ? 'minmax(100px, 1fr) 2fr' : '1fr', gap: 1.5, mb: 1.5 }}>

          <Box sx={{
            bgcolor: theme.palette.primary.main, color: 'white', borderRadius: theme.customSizes?.radius?.xl,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 3,
            boxShadow: `0 4px 12px ${theme.palette.custom?.primary?.[20]}`
          }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 800, mb: 1, letterSpacing: '0.1em' }}>RH</Typography>
            <Typography sx={{ fontSize: theme.customSizes?.font?.h2, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}>{profile.rh || 'N/A'}</Typography>
          </Box>

          {allergies.length > 0 && (
            <Box sx={{
              bgcolor: theme.palette.error.main, color: 'white', borderRadius: theme.customSizes?.radius?.xl,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, px: 2, textAlign: 'center',
              boxShadow: `0 4px 12px ${theme.palette.custom?.tertiary?.[20]}`
            }}>
              <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 800, mb: 1, letterSpacing: '0.1em' }}>ALERGIAS</Typography>
              <WarningAmberRoundedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />

              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', px: 1 }}>
                {allergies.map((allergy, i) => (
                  <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', textAlign: 'center' }}>
                      {allergy.title.toUpperCase()}
                    </Typography>
                    {allergy.medicines && allergy.medicines.length > 0 && (
                      <Box sx={{ mt: 0.5, px: 1.5, py: 0.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: theme.customSizes?.radius?.md }}>
                        <Typography sx={{ fontSize: theme.customSizes?.font?.tiny, fontWeight: 800, opacity: 0.95, letterSpacing: '0.03em', textAlign: 'center' }}>
                          MEDICACIÓN: {allergy.medicines.join(', ').toUpperCase()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Insurance */}
        <Box sx={{
          bgcolor: 'white', borderRadius: theme.customSizes?.radius?.lg, p: 2, mb: 2,
          border: `1px solid ${theme.palette.divider}`, position: 'relative', overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: theme.palette.primary.main }} />
          <Box sx={{ pl: 1 }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.tiny, fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', mb: 1 }}>EPS VIGENTE</Typography>
            <Typography sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', lineHeight: 1 }}>
              {profile.insurance_name || 'NINGUNA'}
              {profile.insurance_number ? ` - ${profile.insurance_number}` : ''}
            </Typography>
          </Box>
        </Box>

        {/* Medical Conditions */}
        {conditions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.tiny, fontWeight: 900, color: 'text.disabled', letterSpacing: '0.1em', mb: 2, px: 1, mt: 3 }}>
              CONDICIONES MÉDICAS
            </Typography>
            <Box sx={{
              bgcolor: 'white', borderRadius: theme.customSizes?.radius?.lg, p: 3,
              border: `1px solid ${theme.palette.divider}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex', flexDirection: 'column', gap: 3
            }}>
              {conditions.map((cond, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocalHospitalRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 1 }} />
                  <Box>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.base, fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', lineHeight: 1 }}>
                      {cond.title}
                    </Typography>
                    {cond.medicines && cond.medicines.length > 0 && (
                      <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 700, color: 'text.secondary', mt: 1, letterSpacing: '0.02em' }}>
                        Medicación: {cond.medicines.join(', ')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Contactos de Emergencia */}
        {profile.sos_contacts && profile.sos_contacts.length > 0 && (
          <Box sx={{ mb: 6, mt: 1 }}>
            <Typography sx={{ fontSize: theme.customSizes?.font?.tiny, fontWeight: 900, color: 'text.disabled', letterSpacing: '0.1em', mb: 2, px: 1 }}>
              CONTACTOS DE EMERGENCIA
            </Typography>
            <Box sx={{
              bgcolor: 'white', borderRadius: theme.customSizes?.radius?.lg, p: 3,
              border: `1px solid ${theme.palette.divider}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex', flexDirection: 'column', gap: 2
            }}>
              {profile.sos_contacts.map((contact, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <PhoneRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 1 }} />
                  <Box>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.base, fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', lineHeight: 1 }}>
                      {contact.name} {contact.last_name || ''}
                    </Typography>
                    <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mt: 1 }}>
                      {contact.relationship} • {contact.phone_indicative || ''} {contact.phone_number}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Emergency Footer Fixed */}
      {
        primaryContact && (
          <Box sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            p: 2, pb: 3,
            background: `linear-gradient(to top, ${theme.palette.background.default} 50%, rgba(251,251,251,0) 100%)`,
            pointerEvents: 'none'
          }}>
            <Button
              variant="contained"
              color="error" // Utilizes standard error color
              href={`tel:${primaryContact.phone_indicative || ''}${primaryContact.phone_number}`}
              sx={{
                pointerEvents: 'auto',
                animation: 'bouncePulse 2.2s infinite ease-in-out', // Adds the bouncing
                maxWidth: 400, mx: 'auto', width: '100%',
                borderRadius: theme.customSizes?.radius?.xl, py: 2, px: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                textTransform: 'none',
                boxShadow: `0 10px 25px ${theme.palette.custom?.tertiary?.[20]}`,
                '&:active': { transform: 'scale(0.98)' },
                '@keyframes bouncePulse': {
                  '0%, 100%': { transform: 'translateY(0) scale(1)' },
                  '50%': { transform: 'translateY(-5px) scale(1.02)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneRoundedIcon sx={{ fontSize: 24 }} />
                <Typography sx={{ fontSize: theme.customSizes?.font?.lg, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  LLAMAR A {primaryContact?.name?.toUpperCase()}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: theme.customSizes?.font?.small, fontWeight: 800, letterSpacing: '0.05em', opacity: 0.9 }}>
                ({primaryContact?.relationship?.toUpperCase()})
              </Typography>
            </Button>
          </Box>
        )
      }

    </Box >
  )
}