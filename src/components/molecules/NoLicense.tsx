import { ActivationInput } from "./ActivationInput"
import { Box, Typography, useTheme } from "@mui/material"

interface NoLicenseProps {
  initialCode?: string
  onVerify: (code: string) => void
}

export function NoLicense({ initialCode, onVerify }: NoLicenseProps) {
  const theme = useTheme()
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'inline-block', bgcolor: theme.palette.custom.neutral[100], px: 1.5, py: 0.5, borderRadius: 1, mb: 2 }}>
          <Typography
            sx={{
              color: theme.palette.primary.main,
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
          Activar Perfil
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: theme.customSizes.font.base,
          }}>
          Ingresa el código de activación de tu manilla.
        </Typography>
      </Box>
      <ActivationInput initialCode={initialCode} onVerify={onVerify} />
    </>
  )
}