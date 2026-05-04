import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Grid,
} from '@mui/material'
import { FormInput } from '../atoms'

interface PasswordResetFormProps {
  title?: string
  description?: string
  onSuccess?: () => void
}

export function PasswordResetForm({
  title = 'Cambia tu contraseña',
  description = 'Por seguridad, debes establecer una nueva contraseña antes de continuar.',
  onSuccess,
}: PasswordResetFormProps) {
  const theme = useTheme()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { requires_password_change: false },
      })

      if (updateError) throw updateError

      toast.success('Contraseña actualizada exitosamente')
      setPassword('')
      setConfirmPassword('')
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.primary[10], px: 1.5, py: 0.5, borderRadius: 1, mb: 2 }}>
          <Typography
            sx={{
              color: theme.palette.custom.primary[100],
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 800,
            }}>
            SEGURIDAD
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            mb: 1,
            letterSpacing: '-0.02em',
          }}>
          {title}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: theme.customSizes.font.base }}>
          {description}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert severity="error" sx={{ bgcolor: theme.palette.custom.tertiary[5], color: theme.palette.custom.tertiary[100] }}>
            {error}
          </Alert>
        )}

        <Box>
          <FormInput
            label="Nueva contraseña"
            name="new-password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder="••••••••"
            required
            autoFocus
            autoComplete="new-password"
          />
        </Box>

        <Box>
          <FormInput
            label="Confirmar contraseña"
            name="confirm-new-password"
            type="password"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </Box>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !password || !confirmPassword}
            sx={{ mt: 2 }}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar contraseña'}
          </Button>
        </Grid>
      </Box>
    </>
  )
}
