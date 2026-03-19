import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile as ProfileType } from '../objects/profile'
import { useEffect, useState } from 'react'
import { UpdateProfile } from './ui/UpdateProfile'
import { CreateProfile } from './ui/CreateProfile'
import toast from 'react-hot-toast'
import { Modal } from './ui/Modal'
import { SideDrawer } from './ui/SideDrawer'
import { useQR } from '../hooks/useQR'
import { QR } from './ui/QR'
import { FloatingButton } from './ui/FloatingButton'
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AddIcon from '@mui/icons-material/Add'

export function Dashboard() {
  const [showQRModal, setShowQRModal] = useState(false)
  const [showNewProfileDrawer, setShowNewProfileDrawer] = useState(false)
  const { qrCode, generateQR } = useQR()
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { profiles, loadProfiles, removeProfile, chooseProfile } = useProfiles()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const reloadProfiles = () => {
    if (!user) return
    supabase.from('PublicUser').select('*').eq('user_id', user.id).then(({ data }) => {
      loadProfiles(data ?? [])
    })
  }

  useEffect(() => {
    reloadProfiles()
  }, [])

  const createProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('PublicUser').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
      chosen: profile.chosen,
      user_id: user?.id,
    })

    if (error) {
      toast.error('Error saving profile')
      return
    }

    reloadProfiles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success(`Perfil ${profile.profile_title} guardado`)
  }

  const updateProfile = async (profile: ProfileType) => {
    const { error } = await supabase
      .from('PublicUser')
      .update({
        profile_description: profile.profile_description,
        profile_title: profile.profile_title,
        data: profile.data,
        chosen: profile.chosen,
      })
      .eq('id', profile.id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    toast.success(`Perfil ${profile.profile_title} actualizado`)
  }

  const updateChosenStatus = async (id: string, profile: ProfileType) => {
    const { error } = await supabase
      .from('PublicUser')
      .update({ chosen: true })
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) {
      toast.error('Error updating profile')
      return
    }

    chooseProfile(id)
    toast.success(`Cambios guardados para: ${profile.profile_title}`)
  }

  const handleDeleteProfile = async (id: string) => {
    const profile = profiles.find((p) => p.id == id)
    if (profile?.chosen) {
      toast.error('No puedes eliminar el perfil activo, primero cambia de perfil y luego elimina')
      return
    }

    const { error } = await supabase.from('PublicUser').delete().eq('id', id).eq('user_id', user?.id)

    if (error) {
      toast.error('Error deleting profile')
      return
    }

    removeProfile(id)
    toast.success('Perfil eliminado')
  }

  const createNewProfileButton = () => {
    return (
      <Button
        onClick={() => setShowNewProfileDrawer(true)}
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          borderColor: 'divider',
          color: 'text.secondary',
          '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'white', color: 'black' },
        }}
      >
        Crear Perfil
      </Button>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Header */}
        <Box component="header" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              Salir
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.04em" sx={{ flexGrow: 1 }}>
              {user?.identities?.[0].identity_data?.display_name}
            </Typography>

            {!isMobile && (
              <Stack direction="row" spacing={1}>
                <Button
                  component="a"
                  href={`/public/${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'white', color: 'black' },
                  }}
                >
                  Visitar perfil publico
                </Button>
                {createNewProfileButton()}
              </Stack>
            )}
          </Box>

          <Divider sx={{ mt: 2, borderColor: 'divider' }} />
        </Box>

        {
          profiles.length === 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, mt: 30 }}>
              <Typography variant="h6" fontSize={30}>
                No tienes perfiles
              </Typography>
              {createNewProfileButton()}
            </Box>
          )
        }

        {/* Profiles List */}
        <Stack component="section" spacing={2} aria-label="Profiles List">
          {profiles.map((profile) => (
            <UpdateProfile
              key={profile.id}
              profile={profile}
              expand={false}
              onChosen={(e) => { e.stopPropagation(); updateChosenStatus(profile.id, profile) }}
              onDelete={(e) => { e.stopPropagation(); handleDeleteProfile(profile.id) }}
              onSave={(updatedProfile) => updateProfile(updatedProfile)}
            />
          ))}
        </Stack>
      </Box>

      {/* Mobile FABs */}
      {isMobile && (
        <>
          <FloatingButton position="bottom-left">
            <Box
              component="a"
              href={`/public/${user?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <OpenInNewIcon sx={{ color: 'black', fontSize: 22 }} />
            </Box>
          </FloatingButton>

          <FloatingButton onClick={() => setShowNewProfileDrawer(true)} position="bottom-center">
            <AddIcon sx={{ color: 'black', fontSize: 26 }} />
          </FloatingButton>
        </>
      )}

      <FloatingButton
        onClick={() => {
          generateQR()
          setShowQRModal(true)
        }}
      >
        <QrCode2Icon sx={{ color: 'black', fontSize: 30 }} />
      </FloatingButton>

      {/* QR Modal */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="Tu Código QR">
        <QR qrCode={qrCode} />
      </Modal>

      {/* New Profile Drawer */}
      <SideDrawer isOpen={showNewProfileDrawer} onClose={() => setShowNewProfileDrawer(false)} title="Nuevo Perfil">
        <CreateProfile
          onSave={(newProfile: ProfileType) => {
            createProfile(newProfile)
            setShowNewProfileDrawer(false)
          }}
        />
      </SideDrawer>
    </Box>
  )
}
