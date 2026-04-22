import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Routes, Route } from 'react-router-dom'
import { SOSContacts } from './SOSContact'
import { ProfilesView } from './ProfilesView'
import { Conditions } from './Conditions'
import { Settings } from './Settings'
import { UnderConstruction, Menu } from './ui'
import { ROUTES } from '../constants'

export function Dashboard() {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 3fr' }, maxWidth: '100vw', overflowX: 'hidden', minHeight: '100vh' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Menu />
      </Box>
      <Box position="relative" pb={{ xs: 4, sm: 4, md: 2 }}>
        {/* Content */}
        <Routes>
          <Route path="/" element={<ProfilesView />} />
          <Route path={ROUTES.PROFILE} element={<ProfilesView />} />
          <Route
            path={ROUTES.SOS_CONTACTS}
            element={<SOSContacts />}
          />
          <Route
            path={ROUTES.CONDITION}
            element={<Conditions />}
          />
          <Route
            path={ROUTES.SETTINGS}
            element={<Settings />}
          />
          <Route
            path={ROUTES.EMERGENCY_HISTORY}
            element={<UnderConstruction />}
          />
        </Routes>
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            width: '100%',
            bottom: 0,
            zIndex: 1000,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.custom.neutral[100]}`
          }}>
          <Menu mobileOnly />
        </Box>
      </Box>
    </Box>
  )
}
