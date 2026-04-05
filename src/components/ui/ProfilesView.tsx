import { useAuth } from '../../contexts/AuthContext'
import { useProfiles } from '../../hooks/useProfiles'
import { type Profile as ProfileType } from '../../objects/profile'
import { useEffect, useState } from 'react'
import { Profile } from './Profile'
import toast from 'react-hot-toast'
import { SideDrawer } from './SideDrawer'
import { ProfileCard } from './ProfileCard'
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Paper,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useQR } from '../../hooks/useQR'
import { EmptyProfile } from './EmptyProfiles'
import { ProfileChosenCard } from './ProfileChosenCard'
import { useGetProfiles, useCreateProfile, useUpdateProfile, useUpdateChosenStatus, useDeleteProfile } from '../../api'

export function ProfilesView() {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)
  const { qrCode, generateQR } = useQR()
  const { user } = useAuth()
  const theme = useTheme()
  const { profiles, loadProfiles, removeProfile, chooseProfile } = useProfiles()
  const [editingProfile, setEditingProfile] = useState<ProfileType>()
  const { getProfiles } = useGetProfiles()
  const { createProfile } = useCreateProfile()
  const { updateProfile } = useUpdateProfile()
  const { updateChosenStatus } = useUpdateChosenStatus()
  const { deleteProfile } = useDeleteProfile()

  const reloadProfiles = async () => {
    if (!user) return
    const profiles = await getProfiles()
    loadProfiles(profiles)
  }

  useEffect(() => {
    generateQR(user?.id)
    reloadProfiles()
  }, [])

  const handleCreateProfile = async (profile: ProfileType) => {
    await createProfile(profile)
    reloadProfiles()
  }

  const handleUpdateChosenStatus = async (id: string) => {
    await updateChosenStatus(id)
    chooseProfile(id)
  }

  const handleDeleteProfile = async (id: string) => {
    const profile = profiles.find((p) => p.id == id)
    if (profile?.chosen) {
      toast.error('No puedes eliminar el perfil activo, primero cambia de perfil y luego elimina')
      return
    }

    try {
      await deleteProfile(id)
      removeProfile(id)
      toast.success('Perfil eliminado')
    } catch (error) {
      toast.error(error as string)
    }
  }

  const createNewProfileButton = () => {
    return (
      <Button
        onClick={() => setOpenProfileDrawer(true)}
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          bgcolor: theme.palette.custom.primary[100],
        }}
      >
        Crear Nuevo Perfil
      </Button>
    )
  }

  const handleOnCloseDrawer = () => {
    setEditingProfile(undefined)
    setOpenProfileDrawer(false)
  }

  const handleShareProfile = (id: string) => {
    window.open(`/public/${id}`, '_blank');
  }

  const mainProfile = profiles.find((p) => p.chosen);
  const otherProfiles = profiles.filter((p) => !p.chosen);

  if (profiles.length === 0 || !mainProfile || !otherProfiles) {
    return <EmptyProfile />
  }

  return (
    <Box component='main' height={'100vh'}>
      {/* Main Content */}
      <Box sx={{ p: 4 }}>
        {/* User information */}
        <Box component="header" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: theme => theme.customSizes.font.small, fontWeight: 700, color: 'text.primary' }}> PANEL DE CONTROL </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h3" fontWeight={700} sx={{ flexGrow: 1, color: theme => theme.palette.primary.main }}>
                Hola, {user?.identities?.[0].identity_data?.display_name}
              </Typography>
            </Box>
          </Box>
          {createNewProfileButton()}
        </Box>

        {/* Profile content*/}
        <Box>
          {/* MAIN PROFILE */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
            <ProfileChosenCard
              profile={mainProfile}
              onEdit={(profile: ProfileType) => {
                setEditingProfile(profile)
                setOpenProfileDrawer(true)
              }}
              onShare={(id: string) => {
                handleShareProfile(id)
              }}
            />

            {/* QR INFORMATION AND BAND ID */}
            <Card sx={{ bgcolor: theme.palette.custom.primary[100] }}>
              <CardContent sx={{ display: 'grid', gridTemplateRows: '1fr 3fr 1fr', gap: 1 }}>
                <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.xl, textAlign: 'center' }}>INFORMACION QR</Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <img src={qrCode} alt="QR Code" style={{ borderRadius: '10px', border: '1px solid white' }} />
                </Box>
                <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 2, display: 'flex', gap: 2, flexDirection: 'column', textAlign: 'center' }}>
                  <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.small }}>ID BANDA</Typography>
                  {/* TODO: Add band id, this current one is just for testing */}
                  <Typography sx={{ color: theme.palette.custom.neutral[100], fontSize: theme.customSizes.font.lg }}>KGD-772-NM</Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Grid container columns={12} spacing={2} aria-label="Profiles List" mt={4}>
          {otherProfiles.map((profile) => (
            <Grid key={profile.id} size={{ xs: 12, sm: 6, md: 4, lg: 6 }}>
              <ProfileCard
                profile={profile}
                onEdit={(profile: ProfileType) => {
                  setEditingProfile(profile)
                  setOpenProfileDrawer(true)
                }}
                onDelete={(id: string) => handleDeleteProfile(id)}
                onSelect={(id: string) => handleUpdateChosenStatus(id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Profile Drawer */}
      <SideDrawer isOpen={openProfileDrawer} onClose={handleOnCloseDrawer} title="Nuevo Perfil" permanent={false}>
        <Profile
          onSave={(profile: ProfileType) => {
            if (profile.id) {
              updateProfile(profile)
            } else {
              handleCreateProfile(profile)
            }
            handleOnCloseDrawer()
          }}
          onDelete={(id: string) => {
            handleDeleteProfile(id)
            handleOnCloseDrawer()
          }}
          profile={editingProfile}
        />
      </SideDrawer>

    </Box>
  )
}