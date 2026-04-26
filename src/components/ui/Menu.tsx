import { useState } from 'react'
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
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ROUTES } from '../../constants'
import { useGetUserQuery } from '../../store/endpoints/usersApi'
import { MonitorHeart, Person, Settings as SettingsIcon, History, Shield } from '@mui/icons-material'

export interface MenuOption {
  label: string
  icon: React.ReactNode
  navigate: string
}
export interface MenuProps {
  onClose?: () => void
  mobileOnly?: boolean
}

export const MENU_OPTIONS: Array<MenuOption> = [
  {
    label: 'Mis Perfiles',
    icon: <Person />,
    navigate: ROUTES.DASHBOARD
  },
  {
    label: 'SOS Contactos',
    icon: <Shield />,
    navigate: `${ROUTES.DASHBOARD}/${ROUTES.SOS_CONTACTS}`
  },
  {
    label: 'Condiciones',
    icon: <MonitorHeart />,
    navigate: `${ROUTES.DASHBOARD}/${ROUTES.CONDITION}`
  },
  {
    label: 'Historial de Emergencias',
    icon: <History />,
    navigate: `${ROUTES.DASHBOARD}/${ROUTES.EMERGENCY_HISTORY}`
  },
  {
    label: 'Ajustes',
    icon: <SettingsIcon />,
    navigate: `${ROUTES.DASHBOARD}/${ROUTES.SETTINGS}`
  },
]

export function Menu({ onClose, mobileOnly }: MenuProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
  const [value, setValue] = useState(0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(ROUTES.LOG_IN)
  }

  const SideMenu = () => {
    return (
      <Box
        sx={{ display: 'grid', gridTemplateRows: '1fr 11fr', p: 2, height: '100%', bgcolor: theme.palette.background.paper }}>
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
            <Person sx={{ color: theme.palette.custom.primary[100] }} />
          </Card>
          <Typography sx={{ color: theme.palette.custom.primary[100], fontSize: theme.customSizes.font.xl, fontWeight: 700 }}>
            {user?.full_name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <List>
            {
              MENU_OPTIONS.map((option) => (
                <ListItem key={option.label}>
                  <ListItemButton onClick={() => { navigate(option.navigate); onClose?.() }}>
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
        <Box sx={{ textAlign: 'center', py: 2, borderTop: `1px solid ${theme.palette.custom.neutral[100]}` }}>
          Developed by <a target="_blank" rel="noopener noreferrer" href="https://github.com/njmercado">Nino Mercado</a>
        </Box>
      </Box>
    )
  }

  const BottomMenu = () => {
    return (<BottomNavigation
      showLabels
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        navigate(MENU_OPTIONS[newValue].navigate);
      }}
    >
      {MENU_OPTIONS.map((option, index) => (
        <BottomNavigationAction key={option.label} value={index} icon={option.icon} />
      ))}
    </BottomNavigation>)
  }

  if (mobileOnly) {
    return <BottomMenu />
  }

  return <SideMenu />
}