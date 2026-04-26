import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  Box,
  Typography,
  Card,
  useTheme,
} from '@mui/material'
import { ROUTES } from '../constants'
import { LandingHeader, RecoverPasswordForm, RecoverPasswordSuccess } from './ui'

export function RecoverPassword() {
  const theme = useTheme()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const redirectTo = `${window.location.origin}${ROUTES.UPDATE_PASSWORD}`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error

      setEmailSent(true)
      toast.success('Correo de recuperación enviado')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar el correo de recuperación'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <LandingHeader />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 0, md: 6 },
        pb: { xs: 10, md: 6 },
      }}>
        <Card sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1200,
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: 'none', md: undefined },
          border: { xs: 'none', md: undefined },
        }}>

          {/* Left Panel — Desktop only */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: '50%',
            bgcolor: theme.palette.primary.main,
            p: 6,
            position: 'relative',
            color: 'white',
            overflow: 'hidden',
          }}>
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: 48, lineHeight: 1, mb: 3, letterSpacing: '-0.02em' }}>
              Recupera el<br />
              <Box component="span" sx={{ color: theme.palette.custom.secondary[100] }}>acceso</Box><br />
              a tu perfil.
            </Typography>
            <Typography sx={{ fontSize: 18, lineHeight: 2, maxWidth: 400 }}>
              Restablece tu contraseña y vuelve a tener acceso a tu información de emergencia.
            </Typography>
          </Box>

          {/* Right Panel — Form/Content */}
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {emailSent
              ? <RecoverPasswordSuccess email={email} />
              : <RecoverPasswordForm
                  email={email}
                  error={error}
                  loading={loading}
                  onEmailChange={setEmail}
                  onSubmit={handleResetPassword}
                />
            }

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                ¿Recordaste tu contraseña?
                <Link to={ROUTES.LOG_IN}> INICIAR SESIÓN</Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      <Box sx={{ textAlign: 'center', py: 2, borderTop: `1px solid ${theme.palette.custom.neutral[100]}` }}>
        Developed by <a target="_blank" rel="noopener noreferrer" href="https://github.com/njmercado">Nino Mercado</a>
      </Box>
    </Box>
  )
}
