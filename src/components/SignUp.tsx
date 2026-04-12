import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  InputLabel,
  Button,
  Checkbox,
  InputAdornment,
  Card,
  useTheme,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import ShieldIcon from '@mui/icons-material/Shield'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useNavigate } from 'react-router-dom'
import { useCreateUser } from '../api'

export function SignUp() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { createUser } = useCreateUser()

  // TODO: Uncomment when terms and conditions are ready
  // const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // TODO: Uncomment when terms and conditions are ready
    // if (!acceptedTerms) {
    //   setError('Debes aceptar los términos de servicio')
    //   setLoading(false)
    //   return
    // }

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name, phone_number: '1025' },
        },
      })
      if (error) throw error

      if (!data.user?.id) {
        throw new Error('User creation failed: No user ID returned')
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (loginError) throw loginError

      await createUser({
        user_id: data.user.id,
        name: name.split(' ')[0],
        last_name: name.split(' ')[1] || '',
        full_name: name,
      })

      toast.success('User created successfully')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 3, md: 6 },
        py: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* here should be the Logo */}
          <Typography sx={{ fontWeight: 900, color: theme.palette.primary.main, fontSize: theme.customSizes.font.lg }}>
            QUIENES
          </Typography>
        </Box>

        {/* Desktop Top Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
          <Typography><Link to="#">AYUDA</Link></Typography>
          <Typography> <Link to="/login">SIGN IN</Link> </Typography>
        </Box>
      </Box>

      {/* Main Split Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 0, md: 6 },
        pb: { xs: 10, md: 6 } // Space for mobile bottom nav
      }}>
        <Card sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1200,
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: 'none', md: undefined },
          border: { xs: 'none', md: undefined }
        }}>

          {/* Left Panel - Hidden on Mobile */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: '50%',
            bgcolor: theme.palette.primary.main,
            p: 6,
            position: 'relative',
            color: 'white',
            overflow: 'hidden'
          }}>
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: 48, lineHeight: 1.1, mb: 3, letterSpacing: '-0.02em' }}>
              Precisión<br />
              <Box component="span" sx={{ color: theme.palette.custom.secondary[100] }}>Quirúrgica</Box><br />
              en cada dato.
            </Typography>

            <Typography sx={{ fontSize: 18, lineHeight: 1.5, opacity: 0.9, maxWidth: 400 }}>
              Únete a la red de tecnología médica diseñada para eliminar la duplicidad administrativa.
              {/* Add hook quote here to atract more users */}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom feature pills */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 2, borderRadius: 2, width: '50%' }}>
                <ShieldIcon sx={{ mb: 1, color: theme.palette.custom.secondary[100] }} />
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', opacity: 0.8, mb: 0.5 }}>PROTOCOLO</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Cifrado</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Panel - Form */}
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.neutral[100], px: 1.5, py: 0.5, borderRadius: 1, mb: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: theme.customSizes.font.tiny,
                    fontWeight: 800,
                  }}>
                  MÓDULO DE REGISTRO
                </Typography>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  fontSize: { xs: theme.customSizes.font.h3, sm: theme.customSizes.font.h2 },
                  mb: 1,
                  letterSpacing: '-0.04em'
                }}>
                Crear Cuenta
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: theme.customSizes.font.base
                }}>
                Complete sus credenciales para acceder al sistema.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              {error && (
                <Alert severity="error" sx={{ bgcolor: theme.palette.custom.tertiary[5] || 'error.light', color: theme.palette.custom.tertiary[100] || 'error.main' }}>
                  {error}
                </Alert>
              )}

              {/* NAME */}
              <Box>
                <InputLabel shrink htmlFor="name-input">FULL NAME</InputLabel>
                <TextField
                  id="name-input"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Julian Casablancas"
                  required
                  autoComplete="name"
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                    }
                  }}
                />
              </Box>

              {/* EMAIL */}
              <Box>
                <InputLabel shrink htmlFor="email-input">EMAIL</InputLabel>
                <TextField
                  id="email-input"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="julian@quienes.med"
                  required
                  autoComplete="email"
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><MailOutlineIcon sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                    }
                  }}
                />
              </Box>

              {/* PASSWORD ROW */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <InputLabel shrink htmlFor="password-input">PASSWORD</InputLabel>
                  <TextField
                    id="password-input"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <InputLabel shrink htmlFor="confirm-password-input">CONFIRM PASSWORD</InputLabel>
                  <TextField
                    id="confirm-password-input"
                    fullWidth
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><VerifiedUserOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} /></InputAdornment>,
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* TERMS */}
              {/* TODO: Add terms and conditions */}
              <Box sx={{ display: 'none', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                <Checkbox
                  checked={false}
                  onChange={() => { }}
                  sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 20, color: 'text.disabled' }, '&.Mui-checked': { color: theme.palette.secondary.main } }}
                />
                <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, lineHeight: 1.4 }}>
                  Acepto los <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.primary.main }}>Términos de Servicio</Typography> y la <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.primary.main }}>Política de Privacidad</Typography> de QuienEs.
                </Typography>
              </Box>

              {/* SUBMIT */}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={loading}
                endIcon={!loading ? <ArrowForwardIcon sx={{ fontSize: 18 }} /> : undefined}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'CREAR CUENTA'}
              </Button>

              {/* DESKTOP ONLY: Login link below form */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mt: 4 }}>
                <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                  Already have an account?{' '}
                  <Link to="/login"> LOGIN </Link>
                </Typography>
              </Box>

            </Box>
          </Box>
        </Card>
      </Box >

      {/* Desktop Footer */}
      < Box sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'space-between',
        px: 6,
        py: 4,
        borderTop: '1px solid rgba(0,0,0,0.04)'
      }
      }>
        {/* Footer content */}
      </Box >

      {/* Mobile Bottom Fixed Nav */}
      < Box sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        zIndex: 50
      }}>
        <Button
          component={Link}
          to="/login"
          sx={{
            flex: 1,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.primary',
            borderRadius: 0,
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <LoginIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>LOGIN</Typography>
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            flex: 1,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            borderRadius: 0
          }}
        >
          <PersonAddAltIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>SIGN UP</Typography>
        </Button>
      </Box >

    </Box >
  )
}
