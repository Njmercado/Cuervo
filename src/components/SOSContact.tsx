import { Box, Typography, useTheme } from "@mui/material"

export function SOSContact() {
  const theme = useTheme()
  return (
    <Box>
      <Typography sx={{ color: theme.palette.custom.primary[100], fontSize: theme.customSizes.font.xl }}>SOS Contact</Typography>
    </Box>
  )
}