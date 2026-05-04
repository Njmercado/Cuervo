import { Box, Typography } from "@mui/material"

export function UnderConstruction() {
  return (
    <Box component='main' height='100vh' sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Typography>Esta vista está en construcción</Typography>
    </Box>
  )
}