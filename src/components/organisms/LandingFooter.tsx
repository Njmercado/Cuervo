import { Box, Typography } from '@mui/material'

// TODO: For the moment these links are not implemented, they will be implemented in the future when the product is stablished after testings, feedback and strong MVP.
// const FOOTER_LINKS = ['Producto', 'Accesorios', 'Privacidad', 'Términos', 'Soporte']

export function LandingFooter() {
  return (
    <>
      <Box
        component="footer"
        sx={{
          width: '100%',
          py: 6,
          px: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: theme => theme.customSizes.font.lg,
              fontWeight: 800,
              color: 'primary.main',
            }}
          >
            QuienEs
          </Typography>
          <Typography
            sx={{
              fontSize: theme => theme.customSizes.font.small,
              color: 'text.secondary',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © 2026 QuienEs. Mejorando la atención de emergencias.
          </Typography>
        </Box>

        {/*
        
        TODO: For the moment these links are not implemented, they will be implemented in the future when the product is stablished after testings, feedback and strong MVP.

        <Box
          component="nav"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {FOOTER_LINKS.map((item) => (
            <MuiLink
              key={item}
              href="#"
              underline="hover"
              sx={{
                fontSize: theme => theme.customSizes.font.base,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {item}
            </MuiLink>
          ))}
        </Box>
        */}
      </Box>
      <Box sx={{ textAlign: 'center', py: 2, borderTop: theme => `1px solid ${theme.palette.custom.neutral[100]}` }}>
        Developed by <a target="_blank" rel="noopener noreferrer" href="https://github.com/njmercado">Nino Mercado</a>
      </Box>
    </>
  )
}
