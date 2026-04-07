import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { type Profile } from '../objects/profile'
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Paper,
  alpha,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useGetChosenProfile } from '../api'

export function Public() {
  const { token } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { getChosen } = useGetChosenProfile()

  useEffect(() => {
    setLoading(true)
    if (!token) {
      setError(true)
      setLoading(false)
      return
    }
    getChosen(token).then((profile) => {
      setProfile(profile)
    }).catch(() => {
      setError(true)
    }).finally(() => {
      setLoading(false)
    })
  }, [token])

  if (loading) {
    return (
      <Box
        component="main"
        sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FavoriteIcon sx={{ color: 'text.disabled', fontSize: 32, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <Skeleton variant="text" width={200} height={20} sx={{ bgcolor: 'divider' }} />
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.disabled' }}>
            Loading Profile...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !profile) {
    return (
      <Box
        component="main"
        sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{ background: (theme) => `linear-gradient(135deg, #fff, ${theme.palette.custom.neutral[100]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            404
          </Typography>
          <Typography variant="body2" color="text.secondary" fontFamily="monospace">
            Profile not found or is private.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        height: '100vh',
        p: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        component="article"
        sx={{
          width: '100%',
          maxWidth: 672,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflowY: 'scroll',
        }}
      >
        {/* Content */}
        <Box sx={{ p: { xs: 4, md: 6 }, position: 'relative', }}>
          {/* Personal Info */}
          <Box component="section" sx={{ mb: 6 }} aria-label="Personal Information">
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <Typography>{profile.data?.fullName}</Typography>
              <Chip label={profile.data?.idType + ' - ' + profile.data?.idNumber} />
            </Box>

            <Box component="section" sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2, textAlign: 'center' }}>
              <Card>
                <CardContent>
                  <Typography>RH</Typography>
                  <Typography>{profile.data?.rh}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography>Alergias</Typography>
                  <Typography>None</Typography>
                </CardContent>
              </Card>
            </Box>

            <Box component="section" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, textAlign: 'center' }}>
              <Card>
                <CardContent>
                  <Typography>EPS VIGENTE</Typography>
                  <Typography>{profile.data?.healthInsurance}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography>CONDICIONES</Typography>
                  <Typography>None</Typography>
                </CardContent>
              </Card>
            </Box>

            {profile.data?.extraInfo && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="caption"
                  component="dt"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: (theme) => theme.palette.custom.neutralLight, display: 'block', mb: 1 }}
                >
                  Información Extra
                </Typography>
                <Box
                  component="dd"
                  sx={{ bgcolor: (theme) => theme.palette.custom.glassBg, border: '1px solid', borderColor: (theme) => alpha(theme.palette.common.white, 0.05), borderRadius: 2, p: 2 }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {profile.data.extraInfo}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Emergency Info */}
          <Button
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: (theme) => theme.palette.error.main,
              color: (theme) => theme.palette.common.white,
              mt: 2,
              width: '100%',
              height: 100,
              '@keyframes ping': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
              animation: 'ping 2s infinite',
            }}>
            <Typography variant='h4' fontWeight={900}>
              LLAMAR A CONTACTO ({profile.data?.emergencyRelationship})
            </Typography>
          </Button>
        </Box>
      </Paper>
    </Box >
  )
}