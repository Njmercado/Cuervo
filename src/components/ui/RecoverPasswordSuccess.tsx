import { Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Alert,
  Button,
  useTheme,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LoginIcon from '@mui/icons-material/Login'
import { ROUTES } from '../../constants'

interface RecoverPasswordSuccessProps {
  email: string
}

export function RecoverPasswordSuccess({ email }: RecoverPasswordSuccessProps) {
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
            ENVIADO
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
          Revisa tu correo
        </Typography>
      </Box>
      <Alert
        severity="info"
        icon={<CheckCircleOutlineIcon />}
        sx={{ bgcolor: theme.palette.custom.primary[10], color: theme.palette.custom.primary[100] }}
      >
        Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones.
      </Alert>
      <Button
        component={Link}
        to={ROUTES.LOG_IN}
        variant="contained"
        color="primary"
        fullWidth
        endIcon={<LoginIcon sx={{ fontSize: 18 }} />}
      >
        IR A INICIAR SESIÓN
      </Button>
    </Box>
  )
}
