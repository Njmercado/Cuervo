import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Card,
  useTheme,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useActivateLicenseMutation, useLazyGetLicenseQuery } from '../store/endpoints/licenseApi'
import { ROUTES } from '../constants'
import { LicenseDetails, NoLicense } from './ui'

export function Activate() {
  const { license_id } = useParams<{ license_id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const [activating, setActivating] = useState(false)

  const [triggerGetLicense, { data: license, isLoading, isError, isUninitialized }] = useLazyGetLicenseQuery()
  const [activateLicense] = useActivateLicenseMutation()

  // Auto-fetch when license_id is present in the URL
  useEffect(() => {
    if (license_id) {
      triggerGetLicense(license_id)
    }
  }, [license_id, triggerGetLicense])

  const handleVerify = async (code: string) => {
    await triggerGetLicense(code)
  }

  const handleActivate = async () => {
    const code = license?.license_id ?? license_id
    if (!code) return
    setActivating(true)
    try {
      await activateLicense(code).unwrap()
      toast.success('¡Tu QuienEs ha sido activado!')
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al activar la licencia'
      toast.error(message)
    } finally {
      setActivating(false)
    }
  }

  const Loading = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: theme.customSizes.font.base }}>
          Verificando código de activación...
        </Typography>
      </Box>
    )
  }

  const InvalidLicense = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.tertiary[5], px: 2, py: 1, borderRadius: 1, mb: 2 }}>
            <Typography
              sx={{
                color: theme.palette.custom.tertiary[100],
                fontSize: theme.customSizes.font.tiny,
                fontWeight: 800,
              }}>
              ERROR
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
            Código inválido
          </Typography>
        </Box>
        <Alert severity="error" sx={{ bgcolor: theme.palette.custom.tertiary[5], color: theme.palette.custom.tertiary[100] }}>
          El código de activación ingresado no es válido. Verifica que sea correcto e intenta de nuevo.
        </Alert>
        <Button
          component={Link}
          to={ROUTES.ACTIVATE}
          variant="outlined"
          fullWidth
        >
          INTENTAR CON OTRO CÓDIGO
        </Button>
      </Box>
    )
  }

  const AlreadyActivated = () => {
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
              YA ACTIVADO
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
            Perfil Activo
          </Typography>
        </Box>
        <Alert
          severity="info"
          icon={<CheckCircleOutlineIcon />}
          sx={{ bgcolor: theme.palette.custom.primary[10], color: theme.palette.custom.primary[100] }}
        >
          Este perfil ya está activo. Inicia sesión con tus credenciales para acceder.
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

  // Determine content to render inside the information card
  const renderContent = () => {
    // Step 1: No license_id in URL and no lookup performed → show manual input
    if (!license_id && isUninitialized) {
      return <NoLicense initialCode={license_id} onVerify={handleVerify} />
    }

    // Step 2: Loading state (includes initial auto-fetch before query starts)
    if (isLoading || (license_id && isUninitialized)) {
      return <Loading />
    }

    // Step 3: Invalid / not found
    if (isError || !license) {
      return <InvalidLicense />
    }

    // Step 4: Already activated
    if (license.is_activated) {
      return <AlreadyActivated />
    }

    // Step 5: Valid license, ready to activate
    return <LicenseDetails license={license} activating={activating} onActivate={handleActivate} />
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 3, md: 6 },
        py: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 900, color: theme.palette.primary.main, fontSize: theme.customSizes.font.lg }}>
            QUIENES
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
          <Typography><Link to={ROUTES.LOG_IN}>INICIAR SESIÓN</Link></Typography>
        </Box>
      </Box>

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
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: 48, lineHeight: 1.1, mb: 3, letterSpacing: '-0.02em' }}>
              Tu identidad<br />
              <Box component="span" sx={{ color: theme.palette.custom.secondary[100] }}>médica</Box><br />
              en tu muñeca.
            </Typography>
            <Typography sx={{ fontSize: 18, lineHeight: 1.5, opacity: 0.9, maxWidth: 400 }}>
              Activa tu perfil QuienEs y lleva tu información de emergencia siempre contigo.
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
            {renderContent()}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
                ¿Ya tienes una cuenta?
                <Link to={ROUTES.LOG_IN}> INICIAR SESIÓN</Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
