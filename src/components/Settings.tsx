import {
  Box,
  Typography
} from "@mui/material"
import { UpdateUserSettings, PasswordResetForm } from "./ui"

export function Settings() {
  return (
    <Box component='main' minHeight='100vh' p={8}>
      <Typography variant="h4" fontWeight={700}>Ajustes</Typography>
      <Box display='flex' flexDirection='column' mt={4} gap={2}>
        <Typography variant="h5" fontWeight={600}>Información personal</Typography>
        <UpdateUserSettings />
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={600}>Cambiar contraseña</Typography>
        <PasswordResetForm title="" description="" />
      </Box>
    </Box>
  )
}