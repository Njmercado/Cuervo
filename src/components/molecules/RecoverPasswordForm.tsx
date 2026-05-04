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

interface RecoverPasswordFormProps {
  email: string
  error: string | null
  loading: boolean
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RecoverPasswordForm({ email, error, loading, onEmailChange, onSubmit }: RecoverPasswordFormProps) {
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
            RECUPERACIÓN
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
          Recuperar
          <br />
          Contraseña
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: theme.customSizes.font.base, mt: 2 }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && (
          <Alert severity="error" sx={{ bgcolor: theme.palette.custom.tertiary[5], color: theme.palette.custom.tertiary[100] }}>
            {error}
          </Alert>
        )}

        <Box>
          <InputLabel shrink htmlFor="recover-email-input">EMAIL *</InputLabel>
          <TextField
            id="recover-email-input"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="nombre@ejemplo.com"
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Enlace'}
        </Button>
      </Box>
    </Box>
  )
}
