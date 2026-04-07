import { Box, Typography, useTheme } from "@mui/material"

export function SOSContact() {
  const theme = useTheme()
  return (
    <Box height={'100vh'} display='flex' alignItems='center' justifyContent='center'>
      <Typography sx={{ color: theme.palette.custom.primary[100], fontSize: theme.customSizes.font.xl }}>This SOS View is under construction</Typography>
    </Box>
  )
}