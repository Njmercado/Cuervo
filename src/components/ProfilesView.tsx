import { type Profile as ProfileType } from '../objects/profile'
import { useEffect, useState } from 'react'
import { Profile } from './ui/Profile'
import toast from 'react-hot-toast'
import { SideDrawer } from './ui/SideDrawer'
import { ProfileCard } from './ui/ProfileCard'
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
import { useQR } from '../hooks/useQR'
import { ProfileChosenCard } from './ui/ProfileChosenCard'
import {
  useGetProfilesQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useUpdateChosenStatusMutation,
  useDeleteProfileMutation,
} from '../store/endpoints/profilesApi'
import { useGetUserQuery } from '../store/endpoints/usersApi'
import { EmptyState } from './ui/EmptyState'
import ShareIcon from '@mui/icons-material/Share'
import { ROUTES } from '../constants'

export function ProfilesView() {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)
  const { qrCode, generateQR } = useQR()
  const theme = useTheme()
  const { data: profiles = [] } = useGetProfilesQuery()
  const [editingProfile, setEditingProfile] = useState<ProfileType>()
  const [createProfile] = useCreateProfileMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const [updateChosenStatus] = useUpdateChosenStatusMutation()
  const [deleteProfile] = useDeleteProfileMutation()
  const { data: user } = useGetUserQuery()

  useEffect(() => {
    generateQR(user?.id)
  }, [user?.id, generateQR])

  const handleCreateProfile = async (profile: ProfileType) => {
    if (profiles.length == 0) {
      profile.chosen = true
    }
    await createProfile(profile).unwrap()
    toast.success(`Perfil ${profile.profile_title} guardado`)
  }

  const handleUpdateChosenStatus = async (id: string, currentChosenProfileId?: string) => {
    await updateChosenStatus({ id, currentChosenProfileId }).unwrap()
    toast.success('Perfil actualizado')
  }

  const handleDeleteProfile = async (id: string) => {
    const profile = profiles.find((p) => p.id == id)
    if (profile?.chosen) {
      toast.error('No puedes eliminar el perfil activo, primero cambia de perfil y luego elimina')
      return
    }

    try {
      await deleteProfile(id).unwrap()
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
    window.open(`${ROUTES.PUBLIC}/${id}`, '_blank');
  }

  const mainProfile = profiles.find((p) => p.chosen);
  const otherProfiles = profiles.filter((p) => !p.chosen);

  const profilesContent = () => {
    return (
      <>
        {/* MAIN PROFILE */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
          <ProfileChosenCard
            profile={mainProfile ?? {} as ProfileType}
            onEdit={(profile: ProfileType) => {
              setEditingProfile(profile)
              setOpenProfileDrawer(true)
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
              <Button variant='text' sx={{
                color: theme.palette.primary.contrastText,
                gap: 1,
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                }
              }} onClick={() => handleShareProfile(user?.user_id || '')}>
                <ShareIcon />
                <span>Visitar Perfil Público</span>
              </Button>
            </CardContent>
          </Card>
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
                onSelect={(id: string) => handleUpdateChosenStatus(id, mainProfile?.id)}
              />
            </Grid>
          ))}
        </Grid>
      </>
    )
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
                Hola, {user?.full_name}
              </Typography>
            </Box>
          </Box>
          {createNewProfileButton()}
        </Box>

        {
          profiles.length === 0 ? (
            <EmptyState
              title="No tienes perfiles creados"
              description="Agrega tu primer perfil para mantener tu información actualizada"
              color={theme.palette.custom.primary[30]}
            />
          ) : (
            profilesContent()
          )
        }
      </Box>

      {/* Profile Drawer */}
      <SideDrawer isOpen={openProfileDrawer} onClose={handleOnCloseDrawer} title="Nuevo Perfil" permanent={false}>
        <Profile
          onSave={(profile: ProfileType) => {
            if (profile.id) {
              updateProfile(profile).unwrap().then(() => toast.success(`Perfil ${profile.profile_title} actualizado`)).catch((err) => toast.error(err.data || 'Error updating profile'))
            } else {
              handleCreateProfile(profile).catch((err) => toast.error(err.data || 'Error creating profile'))
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