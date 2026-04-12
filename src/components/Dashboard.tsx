import { useState } from 'react'
import { Menu } from './ui/Menu'
import { SideDrawer } from './ui/SideDrawer'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import { SOSContacts } from './SOSContact'
import { ProfilesView } from './ProfilesView'
import { Conditions } from './Conditions'

export function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false)
  const handleOnCloseMenu = () => setOpenMenu(false)
  const theme = useTheme()

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 3fr' } }}>
      {/* Menu */}
      <SideDrawer isOpen={openMenu} onClose={handleOnCloseMenu} title="Menu" direction='left' size='small' permanent={!isSmallScreen}>
        <Menu />
      </SideDrawer>
      <Box>
        {/* Header */}
        <Box>
          {isSmallScreen && (
            <IconButton
              onClick={() => setOpenMenu(true)}
            >
              <MenuIcon sx={{ fontSize: theme.customSizes.font.h3, color: theme.palette.custom.primary[100], '&:hover': { color: theme.palette.custom.secondary[100] } }} />
            </IconButton>
          )}
        </Box>
        {/* Content */}
        <Routes>
          <Route path="/" element={<ProfilesView />} />
          <Route
            path="/sos-contact"
            element={<SOSContacts />}
          />
          <Route
            path="/conditions"
            element={<Conditions />}
          />
        </Routes>
      </Box>
    </Box>
  )
}
