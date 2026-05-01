import { type Profile as ProfileType, type ProfileData as ProfileDataType } from '../objects/profile'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Typography,
  useTheme,
  Grid,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {
  useGetProfilesQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useUpdateChosenStatusMutation,
  useDeleteProfileMutation,
} from '../store/endpoints/profilesApi'
import { ProfileChosenCard, QRCard, EmptyState, Profile, SideDrawer, ProfileCard } from './ui'

export function ProfilesView() {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)
  const theme = useTheme()
  const { data: profiles = [] } = useGetProfilesQuery()
  const [editingProfile, setEditingProfile] = useState<ProfileType>()
  const [createProfile] = useCreateProfileMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const [updateChosenStatus] = useUpdateChosenStatusMutation()
  const [deleteProfile] = useDeleteProfileMutation()

  const handleCreateProfile = async (profile: ProfileDataType) => {
    if (profiles.length == 0) {
      profile.chosen = true
    }
    const { error } = await createProfile(profile)

    if (error) {
      toast.error(error as string)
    } else {
      toast.success(`Perfil ${profile.profile_title} guardado`)
    }
  }

  const handleUpdateProfile = async (profile: ProfileType) => {
    const { error } = await updateProfile(profile)

    if (error) {
      toast.error(error as string)
    } else {
      toast.success(`Perfil ${profile.profile_title} actualizado`)
    }
  }

  const handleUpdateChosenStatus = async (id: string) => {
    const { error } = await updateChosenStatus({ id })
    if (error) {
      toast.error(error as string)
    } else {
      toast.success('Perfil actualizado')
    }
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
      <Box>
        <Button
          onClick={() => setOpenProfileDrawer(true)}
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: theme.palette.custom.primary[100],
            display: { xs: 'none', md: 'flex' }
          }}
        >
          Crear Nuevo Perfil
        </Button>

        <IconButton
          onClick={() => setOpenProfileDrawer(true)}
          sx={{
            display: { xs: 'block', md: 'none' }
          }}
        >
          <AddCircleIcon color='primary' fontSize='large' />
        </IconButton>
      </Box>
    )
  }

  const handleOnCloseDrawer = () => {
    setEditingProfile(undefined)
    setOpenProfileDrawer(false)
  }

  const mainProfile = profiles.find((p) => p.chosen);
  const otherProfiles = profiles.filter((p) => !p.chosen);

  const profilesContent = () => {
    return (
      <>
        {/* MAIN PROFILE AND QR SECTION */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '1fr 2fr' }, gap: 2 }}>
          <QRCard />
          {mainProfile ? (
            <ProfileChosenCard
              profile={mainProfile}
              onEdit={(profile: ProfileType) => {
                setEditingProfile(profile)
                setOpenProfileDrawer(true)
              }}
            />
          ) : (
            <EmptyState
              title="No tienes perfiles creados"
              description="Agrega tu primer perfil para mantener tu información actualizada"
              color={theme.palette.custom.primary[30]}
            />
          )}

        </Box>

        {otherProfiles.length > 0 && (
          <Grid container columns={12} spacing={2} aria-label="Profiles List" mt={4}>
            {otherProfiles.map((profile) => (
              <Grid key={profile.id} size={{ xs: 12, sm: 6, md: 6 }}>
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
        )}
      </>
    )
  }

  return (
    <Box component='main'>
      {/* Main Content */}
      <Box sx={{ p: 4 }}>
        {/* User information */}
        <Box component="header" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={700} sx={{ flexGrow: 1, color: theme.palette.primary.main, fontSize: { xs: theme.customSizes.font.xl, md: theme.customSizes.font.h2 } }}>
            Perfiles
          </Typography>
          {createNewProfileButton()}
        </Box >

        {profilesContent()}
      </Box >

      {/* Profile Edit/Create Drawer */}
      < SideDrawer isOpen={openProfileDrawer} onClose={handleOnCloseDrawer} title="Nuevo Perfil" permanent={false} >
        <Profile
          onSave={(profile: ProfileDataType) => {
            handleCreateProfile(profile)
            handleOnCloseDrawer()
          }}
          onUpdate={(profile: ProfileType) => {
            handleUpdateProfile(profile)
            handleOnCloseDrawer()
          }}
          onDelete={(id: string) => {
            handleDeleteProfile(id)
            handleOnCloseDrawer()
          }}
          profile={editingProfile}
        />
      </SideDrawer >

    </Box >
  )
}