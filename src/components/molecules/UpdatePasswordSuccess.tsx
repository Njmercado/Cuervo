import {
  Box,
  Typography,
  Alert,
  Button,
  useTheme,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LoginIcon from '@mui/icons-material/Login'

interface UpdatePasswordSuccessProps {
  onGoToLogin: () => void
}

export function UpdatePasswordSuccess({ onGoToLogin }: UpdatePasswordSuccessProps) {
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
            LISTO
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
          Contraseña actualizada
        </Typography>
      </Box>
      <Alert
        severity="info"
        icon={<CheckCircleOutlineIcon />}
        sx={{ bgcolor: theme.palette.custom.primary[10], color: theme.palette.custom.primary[100] }}
      >
        Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
      </Alert>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        endIcon={<LoginIcon sx={{ fontSize: 18 }} />}
        onClick={onGoToLogin}
      >
        IR A INICIAR SESIÓN
      </Button>
    </Box>
  )
}
