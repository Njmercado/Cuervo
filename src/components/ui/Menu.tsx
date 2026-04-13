import {
  Box,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Typography,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export interface MenuOption {
  label: string
  icon: React.ReactNode
  action: () => void
}



export function Menu() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user } = useAuth()

  const OPTIONS: Array<MenuOption> = [
    {
      label: 'Mis Perfiles',
      icon: <PersonIcon />,
      action: () => { navigate('/dashboard') }
    },
    {
      label: 'SOS Contactos',
      icon: <PersonIcon />,
      action: () => { navigate('/dashboard/sos-contact') }
    },
    {
      label: 'Condiciones',
      icon: <PersonIcon />,
      action: () => { navigate('/dashboard/conditions') }
    },
    {
      label: 'Historial de Emergencias',
      icon: <PersonIcon />,
      action: () => { navigate('/dashboard/emergency-history') }
    },
    {
      label: 'Ajustes',
      icon: <PersonIcon />,
      action: () => { navigate('/dashboard/settings') }
    },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <Box
      sx={{ display: 'grid', gridTemplateRows: '1fr 11fr', p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Card
          sx={{
            height: theme.customSizes.font.h1,
            width: theme.customSizes.font.h1,
            p: 2,
            bgcolor: theme.palette.custom.primary[10],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PersonIcon sx={{ color: theme.palette.custom.primary[100] }} />
        </Card>
        <Typography sx={{ color: theme.palette.custom.primary[100], fontSize: theme.customSizes.font.xl, fontWeight: 700 }}>
          {user?.identities?.[0].identity_data?.display_name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <List>
          {
            OPTIONS.map((option) => (
              <ListItem key={option.label}>
                <ListItemButton onClick={option.action}>
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText primary={option.label} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>

        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  )
}