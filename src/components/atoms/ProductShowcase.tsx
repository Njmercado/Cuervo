import { Box, useTheme } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const BRACELET_IMAGE_URL = '/bracelet.jpg'

export function ProductShowcase() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: theme.customSizes.radius.xl,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Box
        component="img"
        src={BRACELET_IMAGE_URL}
        alt="Pulsera de identificación médica QuienEs"
        sx={{
          width: '100%',
          height: { xs: 320, md: 440 },
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        }}
      />
      {/* Overlay badge */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'white',
          fontSize: theme.customSizes.font.small,
          fontWeight: 600,
        }}
      >
        <VerifiedUserIcon sx={{ fontSize: 18 }} />
        Producto verificado
      </Box>
    </Box>
  )
}
