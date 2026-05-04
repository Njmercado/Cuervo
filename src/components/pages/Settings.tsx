import {
  Box,
  Typography,
  Button
} from "@mui/material"
import { PasswordResetForm } from '../molecules'
import { UpdateUserSettings } from '../organisms'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ROUTES } from '../../constants';

export function Settings() {

  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(ROUTES.LOG_IN)
  }

  return (
    <Box component='main' p={8}>
      <Typography variant="h4" fontWeight={700}>Ajustes</Typography>
      <Box display='flex' flexDirection='column' mt={4} gap={2}>
        <Typography variant="h5" fontWeight={600}>Información personal</Typography>
        <UpdateUserSettings />
      </Box>

      <Box mt={8}>
        <Typography variant="h5" fontWeight={600}>Cambiar contraseña</Typography>
        <PasswordResetForm title="" description="" />
      </Box>

      <Button variant='contained' onClick={handleLogout} color='error' sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 8 }} fullWidth>
        <LogoutIcon />
        <Typography fontWeight={600}>Cerrar Sesion</Typography>
      </Button>
    </Box>
  )
}