import { Box, Typography, Button, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import type { Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import WatchIcon from '@mui/icons-material/Watch'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { ROUTES } from '../constants'
import { LandingHeader } from './ui/LandingHeader'
import { LandingFooter } from './ui/LandingFooter'

const HERO_IMAGE_URL = '/hero-medical.jpg'

interface StepCardData {
  number: string
  icon: ReactNode
  title: string
  description: string
  accentBg: string
  iconBg: string
  iconColor: string
}

const STEPS: StepCardData[] = [
  {
    number: '01',
    icon: <WatchIcon sx={{ fontSize: 32 }} />,
    title: 'Usa tu pulsera de identificación',
    description:
      'Lleva tu pulsera en todo momento. Diseñada para soportar condiciones extremas sin perder legibilidad.',
    accentBg: 'rgba(0, 110, 42, 0.05)',
    iconBg: 'primary.main',
    iconColor: 'primary.contrastText',
  },
  {
    number: '02',
    icon: <QrCodeScannerIcon sx={{ fontSize: 32 }} />,
    title: 'Escaneo de Emergencia',
    description:
      'En caso de incidente, los equipos de rescate escanean el código QR único impreso en tu pulsera desde cualquier smartphone.',
    accentBg: 'rgba(0, 200, 83, 0.05)',
    iconBg: 'secondary.main',
    iconColor: 'secondary.contrastText',
  },
  {
    number: '03',
    icon: <FolderSharedIcon sx={{ fontSize: 32 }} />,
    title: 'Acceso Instantáneo a Datos',
    description:
      'El personal médico accede a tu información médica guardada al instante, permitiendo decisiones rápidas.',
    accentBg: 'rgba(198, 40, 40, 0.05)',
    iconBg: 'error.main',
    iconColor: 'error.contrastText',
  },
]

/* ─── Step Card ─── */
interface StepCardProps {
  step: StepCardData
}

function StepCard({ step }: StepCardProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: theme.customSizes.radius.xl,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Decorative circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -32,
          right: -32,
          width: 128,
          height: 128,
          borderRadius: '0 0 0 100%',
          bgcolor: step.accentBg,
          transition: 'transform 0.3s ease',
          'div:hover > &': { transform: 'scale(1.1)' },
        }}
      />

      {/* Icon container */}
      <Box
        sx={{
          width: 64,
          height: 64,
          bgcolor: step.iconBg,
          color: step.iconColor,
          borderRadius: theme.customSizes.radius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {step.icon}
      </Box>

      <Typography
        sx={{
          color: 'primary.main',
          fontWeight: 700,
          fontSize: theme.customSizes.font.xl,
          mb: 1,
        }}
      >
        {step.number}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 1.5,
          fontSize: theme.customSizes.font.xl,
          lineHeight: 1.3,
        }}
      >
        {step.title}
      </Typography>

      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: theme.customSizes.font.base,
          lineHeight: 1.6,
        }}
      >
        {step.description}
      </Typography>
    </Box>
  )
}

/* ─── Hero Section ─── */
function HeroSection() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        px: { xs: 3, md: 6 },
        py: { xs: 10, md: 16 },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: theme.customSizes.contentWidth,
        mx: 'auto',
        gap: { xs: 6, lg: 12 },
      }}
    >
      {/* Background surface */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: (t: Theme) => t.palette.custom.neutral[70],
          borderRadius: theme.customSizes.radius.xl,
          mx: { xs: 2, md: 6 },
          mt: 4,
          zIndex: -1,
          opacity: 0.5,
        }}
      />

      {/* Text content */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: 'center', md: 'left' },
          zIndex: 1,
          maxWidth: 640,
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: theme.customSizes.radius.pill,
            bgcolor: (t: Theme) => t.palette.custom.primary[10],
            color: 'primary.main',
            fontSize: theme.customSizes.font.small,
            fontWeight: 600,
            mb: 3,
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 16 }} />
          Ayuda extra para el paciente
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            fontSize: { xs: theme.customSizes.font.h3, md: theme.customSizes.font.h2, lg: theme.customSizes.font.h1 },
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            mb: 3,
          }}
        >
          La Información que Salva Vidas, a un QR de distancia.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: theme.customSizes.font.lg, md: theme.customSizes.font.xl },
            color: 'text.secondary',
            maxWidth: 540,
            mx: { xs: 'auto', md: 0 },
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Accesorio de identificación médica de emergencia. Una ayuda extra para facilitar
          la lectura de condiciones médicas y brindar acceso instantáneo a primeros
          respondientes en Colombia.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Button
            component={Link}
            to={ROUTES.ACTIVATE}
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: theme.customSizes.radius.pill,
              px: 4,
              py: 1.5,
              fontSize: theme.customSizes.font.lg,
              boxShadow: '0 8px 24px rgba(0, 110, 42, 0.2)',
            }}
          >
            Activar Manilla
          </Button>
          <Button
            component={Link}
            to={ROUTES.LOG_IN}
            variant="outlined"
            sx={{
              borderRadius: theme.customSizes.radius.pill,
              px: 4,
              py: 1.5,
              fontSize: theme.customSizes.font.lg,
              borderWidth: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderWidth: 2,
                bgcolor: (t: Theme) => t.palette.custom.neutral[100],
              },
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>

      {/* Hero Image */}
      <Box sx={{ flex: 1, width: '100%', maxWidth: 420, zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: theme.customSizes.radius.xl,
            overflow: 'hidden',
            aspectRatio: '4 / 5',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
            ring: 4,
            bgcolor: 'background.paper',
            border: `4px solid ${theme.palette.custom.neutral[100]}`,
          }}
        >
          <Box
            component="img"
            src={HERO_IMAGE_URL}
            alt="Médico con tablet revisando información"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            }}
          />
          {/* Overlay text */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              color: 'white',
              fontSize: theme.customSizes.font.small,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <VerifiedUserIcon sx={{ fontSize: 18 }} />
            Acceso verificado
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── How It Works Section ─── */
function HowItWorksSection() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 12 },
        px: { xs: 3, md: 6 },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ maxWidth: theme.customSizes.contentWidth, mx: 'auto' }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: theme.customSizes.font.h3, md: theme.customSizes.font.h2 },
              mb: 2,
            }}
          >
            Cómo Funciona
          </Typography>
          <Typography
            sx={{
              fontSize: theme.customSizes.font.lg,
              color: 'text.secondary',
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            Tres pasos simples para asegurar tu tranquilidad en situaciones críticas.
          </Typography>
        </Box>

        {/* Step Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Value Proposition Bento Grid ─── */
function ValueGridSection() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 12 },
        px: { xs: 3, md: 6 },
        bgcolor: (t: Theme) => t.palette.custom.neutral[100],
      }}
    >
      <Box
        sx={{
          maxWidth: theme.customSizes.contentWidth,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gridAutoRows: { xs: 'auto', md: 250 },
          gap: 3,
        }}
      >
        {/* Card 1: Acceso Vital Continuo — spans 2 cols, 2 rows */}
        <Box
          sx={{
            gridColumn: { md: 'span 2' },
            gridRow: { md: 'span 2' },
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: theme.customSizes.radius.xl,
            p: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {/* Radial gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.2,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.6), transparent)',
            }}
          />
          {/* Top-right icon */}
          <Box
            sx={{
              position: 'absolute',
              top: 32,
              right: 32,
              bgcolor: 'rgba(255,255,255,0.2)',
              p: 2,
              borderRadius: theme.customSizes.radius.circle,
              backdropFilter: 'blur(8px)',
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 36 }} />
          </Box>
          {/* Content */}
          <Box sx={{ zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: theme.customSizes.font.h3, md: theme.customSizes.font.h3 },
              }}
            >
              Acceso Vital Continuo
            </Typography>
            <Typography
              sx={{
                fontSize: theme.customSizes.font.lg,
                maxWidth: 420,
                opacity: 0.85,
                lineHeight: 1.6,
              }}
            >
              Tu información médica esencial siempre actualizada y disponible al
              instante, brindando una ayuda extra vital para el personal de salud en
              emergencias.
            </Typography>
          </Box>
        </Box>

        {/* Card 2: Alta Visibilidad */}
        <Box
          sx={{
            gridColumn: { md: 'span 2' },
            bgcolor: 'background.paper',
            borderRadius: theme.customSizes.radius.xl,
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              bgcolor: (t: Theme) => t.palette.custom.neutral[100],
            },
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              borderRadius: theme.customSizes.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <VisibilityIcon sx={{ fontSize: 36 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: theme.customSizes.font.xl,
              }}
            >
              Alta Visibilidad
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: theme.customSizes.font.base,
              }}
            >
              Diseño contrastante y legibilidad garantizada incluso en condiciones
              extremas o desgaste prolongado.
            </Typography>
          </Box>
        </Box>

        {/* Card 3: Seguridad Blindada */}
        <Box
          sx={{
            gridColumn: { md: 'span 2' },
            bgcolor: 'background.paper',
            borderRadius: theme.customSizes.radius.xl,
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              bgcolor: (t: Theme) => t.palette.custom.tertiary[20],
              color: (t: Theme) => t.palette.custom.tertiary[100],
              borderRadius: theme.customSizes.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <LockIcon sx={{ fontSize: 36 }} />
          </Box>
          <Box sx={{ zIndex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: theme.customSizes.font.xl,
              }}
            >
              Seguridad Blindada
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: theme.customSizes.font.base,
              }}
            >
              Tus datos sensibles protegidos mediante PIN code. Solo el personal
              autorizado accede a detalles críticos.
            </Typography>
          </Box>
          {/* Background decorative icon */}
          <SecurityIcon
            sx={{
              position: 'absolute',
              right: -48,
              bottom: -48,
              fontSize: 200,
              opacity: 0.04,
              color: 'text.primary',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Landing Page ─── */
export function Landing() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: '64px',
      }}
    >
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />
        <HowItWorksSection />
        <ValueGridSection />
      </Box>
      <LandingFooter />
    </Box>
  )
}