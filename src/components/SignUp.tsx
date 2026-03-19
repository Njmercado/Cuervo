import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCard } from './ui/QRCard'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export function SignUp() {
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [seePassword, setSeePassword] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
        },
      })
      if (error) throw error
      setShowQR(true)
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
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 4 }}>
        <Box component="img" src="black.png" alt="crow simple image" sx={{ width: 80 }} />
        <Typography variant="h4" fontWeight={900} letterSpacing="-0.05em" color="text.primary">
          CUERVO
        </Typography>
      </Box>

      {!showQR ? (
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: '0 0 50px rgba(255,255,255,0.07)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSignUp}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  color: '#ef9a9a',
                  '& .MuiAlert-icon': { color: '#ef9a9a' },
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              fullWidth
              variant="standard"
              slotProps={{
                inputLabel: {
                  sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }
                }
              }}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              fullWidth
              required
              variant="standard"
              slotProps={{
                inputLabel: {
                  sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }
                }
              }}
            />

            <TextField
              label="Password"
              type={seePassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              fullWidth
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      onClick={() => setSeePassword(!seePassword)}
                    >
                      {seePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                },
                inputLabel: {
                  sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }
                }
              }}
              variant="standard"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ py: 1.8 }}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Or sign up with
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.04)' },
            }}
          >
            Google
          </Button>

          <Typography variant="caption" color="text.secondary" align="center">
            Already have an account?{' '}
            <Box
              component={Link}
              to="/"
              sx={{ color: 'text.primary', textDecoration: 'underline', '&:hover': { color: 'text.secondary' } }}
            >
              Sign in
            </Box>
          </Typography>
        </Box>
      ) : (
        <QRCard />
      )}
    </Box>
  )
}
