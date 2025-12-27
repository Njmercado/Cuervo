import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile as ProfileType } from '../objects/profile'
import { useEffect } from 'react'
import { Profile } from './Profile'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    profiles,
    loadProfiles,
    addProfile,
    removeProfile,
    toggleProfile,
    activateProfile,
    updateProfileMeta,
    updateProfileData
  } = useProfiles()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const reloadProfiles = () => {
    if (!user) return
    supabase.from('PublicUser').select('*').eq('user_id', user.id).then(({ data }) => {
      loadProfiles(data ?? []);
    })
  }

  useEffect(() => {
    reloadProfiles()
  }, [user?.id])

  const createProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('PublicUser').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
      chosen: profile.chosen,
      user_id: user?.id
    });

    if (error) {
      console.error('Error saving profile:', error)
      toast.error('Error saving profile')
      return
    }

    reloadProfiles()

    toast.success(`Perfil ${profile.profile_title} guardado`)
  }

  const updateProfile = async (profile: ProfileType) => {
    const { error } = await supabase.from('PublicUser').update({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
      chosen: profile.chosen,
    })
      .eq('id', profile.id)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating profile:', error)
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
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile')
      return
    }

    toast.success(`Cambios guardados para: ${profile.profile_title}`)
  }

  const handleDeleteProfile = async (id: string | undefined, index: number) => {
    if (!id) return

    const profile = profiles.find(p => p.id == id)
    if (profile?.chosen) {
      toast.error('No puedes eliminar el perfil activo, primero cambia de perfil y luego elimina')
      return;
    }

    const { error } = await supabase.from('PublicUser').delete().eq('id', id).eq('user_id', user?.id)

    if (error) {
      toast.error('Error deleting profile')
      return
    }

    removeProfile(id, index)
    toast.success(`Perfil eliminado`)
  }

  const handleUpdateChosenStatus = async (id: string | undefined, index: number, profile: ProfileType) => {
    activateProfile(profile.id, index)
    if (!id) return
    updateChosenStatus(id, profile)
  }

  return (
    <main className="min-h-screen min-w-screen bg-black p-8 text-white">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-white/10 transition-colors uppercase tracking-widest cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-white/20 pb-6">
          <h1 className="text-3xl font-bold tracking-tighter">{user?.email}</h1>
          <div className="flex gap-4">
            <button
              onClick={addProfile}
              className="px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Add Profile
            </button>

          </div>
        </header>

        <section className="space-y-4" aria-label="Profiles List">
          {profiles.map((profile, index) => (
            <Profile
              key={profile.id || index}
              profile={profile}
              index={index}
              onToggle={() => toggleProfile(profile.id, index)}
              onActivate={(e) => { e.stopPropagation(); handleUpdateChosenStatus(profile.id, index, profile); }}
              onDelete={(e) => { e.stopPropagation(); handleDeleteProfile(profile.id, index); }}
              onUpdateMeta={(field, value) => updateProfileMeta(profile.id, index, field, value)}
              onUpdateData={(field, value) => updateProfileData(profile.id, index, field, value)}
              onSave={() => profile.id ? updateProfile(profile) : createProfile(profile)}
            />
          ))}
        </section>
      </div>
    </main>
  )
}
