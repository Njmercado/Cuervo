import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  InputLabel,
  Button,
  Card,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import { ROUTES } from '../constants'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Logo */}
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* here should be the Logo */}
          <Typography sx={{ fontWeight: 900, color: '#006E2A', fontSize: theme => theme.customSizes.font.lg }}>
            QUIENES
          </Typography>
        </Box>
      </Box>

      {/* Main Container */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 440,
          mx: 'auto',
          px: { xs: 3, sm: 0 },
        }}
      >
        {/* Title Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ width: 32, height: 3, bgcolor: theme => theme.palette.divider, mb: 2 }} />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: theme => theme.palette.text.primary,
              fontSize: { xs: 40, sm: 48 },
              lineHeight: 1.1,
              mb: 1.5,
              letterSpacing: '-0.04em',
            }}
          >
            Iniciar
            <br />
            Sesión
          </Typography>
        </Box>

        {/* Form Card */}
        <Card sx={{ p: { xs: 3, sm: 4 }, mb: 4 }}>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme => theme.size(6),
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  bgcolor: (theme) => theme.palette.custom?.tertiary[5] || 'error.light',
                  color: (theme) => theme.palette.custom?.tertiary[100] || 'error.main',
                }}
              >
                {error}
              </Alert>
            )}

            <Box>
              <InputLabel shrink htmlFor="email-input">EMAIL *</InputLabel>
              <TextField
                id="email-input"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                required
              />
            </Box>

            <Box>
              <InputLabel shrink htmlFor="password-input">PASSWORD *</InputLabel>
              <TextField
                id="password-input"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              endIcon={!loading ? <ArrowForwardIcon sx={{ fontSize: theme => theme.customSizes.font.base }} /> : undefined}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
              <Typography
                component={Link}
                to="#"
                sx={{
                  fontSize: theme => theme.customSizes.font.small,
                  fontWeight: 700,
                  color: '#888',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  '&:hover': { color: '#555' }
                }}
              >
                ¿OLVIDASTE TU CONTRASEÑA?
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Footer actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 6 }}>
          <Typography sx={{ fontSize: theme => theme.customSizes.font.base, color: '#666' }}>
            ¿Tienes una manilla QuienEs?
          </Typography>
          <Button
            component={Link}
            to="/activate"
            endIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: theme => theme.customSizes.font.lg }} />}
            variant='contained'
            color='secondary'
          >
            Activar Manilla
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
