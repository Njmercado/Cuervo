import {
  Box,
  Typography
} from "@mui/material"
import { UpdateUserSettings } from "./ui/UpdateUserSettings"

export function Settings() {
  return (
    <Box component='main' height='100vh' p={4}>
      <Typography variant="h4" fontWeight={700}>Ajustes</Typography>
      <Box display='flex' flexDirection='column' mt={4} gap={2}>
        <Typography variant="h5" fontWeight={600}>Información personal</Typography>
        <UpdateUserSettings />
      </Box>
    </Box>
  )
}