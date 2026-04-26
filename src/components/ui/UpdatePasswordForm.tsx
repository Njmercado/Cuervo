import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  InputLabel,
  Button,
  useTheme,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface UpdatePasswordFormProps {
  password: string
  confirmPassword: string
  error: string | null
  loading: boolean
  onPasswordChange: (password: string) => void
  onConfirmPasswordChange: (confirmPassword: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function UpdatePasswordForm({
  password,
  confirmPassword,
  error,
  loading,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: UpdatePasswordFormProps) {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.primary[10], px: 2, py: 1, borderRadius: 1, mb: 2 }}>
          <Typography
            sx={{
              color: theme.palette.custom.primary[100],
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 800,
            }}>
            NUEVA CONTRASEÑA
          </Typography>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            fontSize: { xs: theme.customSizes.font.h3, sm: theme.customSizes.font.h2 },
            mb: 1,
            letterSpacing: '-0.04em',
          }}>
          Actualizar
          <br />
          Contraseña
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: theme.customSizes.font.base, mt: 2 }}>
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && (
          <Alert severity="error" sx={{ bgcolor: theme.palette.custom.tertiary[5], color: theme.palette.custom.tertiary[100] }}>
            {error}
          </Alert>
        )}

        <Box>
          <InputLabel shrink htmlFor="new-password-input">NUEVA CONTRASEÑA *</InputLabel>
          <TextField
            id="new-password-input"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Box>

        <Box>
          <InputLabel shrink htmlFor="confirm-password-input">CONFIRMAR CONTRASEÑA *</InputLabel>
          <TextField
            id="confirm-password-input"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
          endIcon={!loading ? <ArrowForwardIcon sx={{ fontSize: 18 }} /> : undefined}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Contraseña'}
        </Button>
      </Box>
    </Box>
  )
}
