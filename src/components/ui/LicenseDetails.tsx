import { Chip, Typography, Box, Card, Button, CircularProgress, useTheme } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import type { License } from '../../objects/license'

interface LicenseDetailsProps {
  license: License
  activating: boolean
  onActivate: () => void
}

export function LicenseDetails({ license, activating, onActivate }: LicenseDetailsProps) {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.primary[10], px: 1.5, py: 0.5, borderRadius: 1, mb: 2 }}>
          <Typography
            sx={{
              color: theme.palette.custom.primary[100],
              fontSize: theme.customSizes.font.tiny,
              fontWeight: 800,
            }}>
            ACTIVACIÓN DE CUENTA
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
          ¡Hola, {license.user_name}!
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: theme.customSizes.font.base,
          }}>
          Tu cuenta QuienEs está lista para ser activada.
        </Typography>
      </Box>

      {/* License details */}
      <Card sx={{ p: 3, bgcolor: theme.palette.background.default }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonOutlineIcon sx={{ color: theme.palette.custom.primary[100], fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: theme.customSizes.font.tiny, fontWeight: 800, color: theme.palette.text.secondary, letterSpacing: '0.05em' }}>
                NOMBRE
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: theme.customSizes.font.base }}>
                {license.user_name}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MailOutlineIcon sx={{ color: theme.palette.custom.primary[100], fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: theme.customSizes.font.tiny, fontWeight: 800, color: theme.palette.text.secondary, letterSpacing: '0.05em' }}>
                EMAIL
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: theme.customSizes.font.base }}>
                {license.user_email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={license.license_id}
              size="small"
              sx={{
                bgcolor: theme.palette.custom.primary[10],
                color: theme.palette.custom.primary[100],
                fontWeight: 700,
                fontSize: theme.customSizes.font.small,
                letterSpacing: '0.05em',
              }}
            />
          </Box>
        </Box>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        disabled={activating}
        onClick={onActivate}
        endIcon={!activating ? <ArrowForwardIcon sx={{ fontSize: 18 }} /> : undefined}
        sx={{ mt: 1 }}
      >
        {activating ? <CircularProgress size={24} color="inherit" /> : 'ACTIVAR MI QUIENES'}
      </Button>
    </Box>
  )
}