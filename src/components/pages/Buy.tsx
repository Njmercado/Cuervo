import {
  Box,
  Typography,
  Button,
  Card,
  useTheme,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { LandingHeader } from '../organisms'
import { LandingFooter } from '../organisms'
import { ProductShowcase } from '../atoms'
import { PurchaseForm } from '../organisms'

const PRODUCT_FEATURES = [
  'Silicona médica hipoalergénica',
  'Código QR único grabado',
  'Resistente al agua y sudor',
  'Acceso digital a perfil médico',
]

export function Buy() {
  const theme = useTheme()

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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            maxWidth: theme.customSizes.contentWidth,
            mx: 'auto',
          }}
        >
          {/* Back link */}
          <Button
            component={Link}
            to={ROUTES.LANDING}
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: theme.customSizes.font.base,
              '&:hover': {
                bgcolor: (t: Theme) => t.palette.custom.neutral[100],
              },
            }}
          >
            Volver al inicio
          </Button>

          {/* Page header */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ width: 32, height: 3, bgcolor: 'divider', mb: 2 }} />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                fontSize: {
                  xs: theme.customSizes.font.h3,
                  md: theme.customSizes.font.h2,
                },
                letterSpacing: '-0.03em',
                lineHeight: 1,
                mb: 2,
              }}
            >
              Adquiere tu Pulsera
            </Typography>
            <Typography
              sx={{
                fontSize: theme.customSizes.font.lg,
                color: 'text.secondary',
                maxWidth: 600,
                lineHeight: 2,
              }}
            >
              Tu identificación médica de emergencia. Llena tus datos y continúa
              el proceso de compra directamente por WhatsApp.
            </Typography>
          </Box>

          {/*
            Grid layout — 3 children, single definition, no duplication.
            Desktop: image + features on left column, form on right spanning both rows.
            Mobile:  image → form → features (reordered via CSS order).
          */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gridTemplateRows: { md: 'auto auto' },
              gap: { xs: 4, md: 6 },
              alignItems: 'start',
            }}
          >
            {/* Image — always first */}
            <Box sx={{ order: { xs: 1, md: 1 }, gridColumn: { md: '1' } }}>
              <ProductShowcase />
            </Box>

            {/* Form — second on mobile, spans right column on desktop */}
            <Box sx={{ order: { xs: 2, md: 2 }, gridColumn: { md: '2' }, gridRow: { md: '1 / 3' } }}>
              <PurchaseForm />
            </Box>

            {/* Features — third on mobile, below image on desktop */}
            <Card sx={{ order: { xs: 3, md: 3 }, gridColumn: { md: '1' }, p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  fontSize: theme.customSizes.font.lg,
                }}
              >
                ¿Qué incluye?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PRODUCT_FEATURES.map((feature) => (
                  <Box
                    key={feature}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 20, color: 'primary.main' }}
                    />
                    <Typography
                      sx={{
                        fontSize: theme.customSizes.font.base,
                        color: 'text.secondary',
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
      <LandingFooter />
    </Box>
  )
}
