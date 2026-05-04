import { Box, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ROUTES } from '../../constants'

export function LandingHeader() {
  const navigate = useNavigate()
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        height: 64,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => navigate(ROUTES.LANDING)}>
        <MedicalServicesIcon
          sx={{ color: 'primary.main', fontSize: 28 }}
        />
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '-0.02em',
          }}
        >
          QuienEs
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to={ROUTES.BUY}
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: (theme) => theme.customSizes.radius.pill,
            px: 3,
            py: 1,
            boxShadow: '0 4px 12px rgba(0, 110, 42, 0.2)',
          }}
        >
          Comprar
        </Button>
        <Button
          component={Link}
          to={ROUTES.LOG_IN}
          variant="outlined"
          sx={{
            borderRadius: (theme) => theme.customSizes.radius.pill,
            px: 3,
            py: 1,
            borderWidth: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  )
}
