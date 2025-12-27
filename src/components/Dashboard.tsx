import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile as ProfileType } from '../objects/profile'
import { useEffect } from 'react'
import { Profile } from './Profile'
import { INITIAL_PROFILE_DATA } from '../constants/profile.constant'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    profiles,
    loadProfiles,
    removeProfile,
    chooseProfile,
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
  }, [])

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

    window.scrollTo({ top: 0, behavior: 'smooth' })
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

    chooseProfile(id)
    toast.success(`Cambios guardados para: ${profile.profile_title}`)
  }

  const handleDeleteProfile = async (id: string) => {
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

    removeProfile(id)
    toast.success(`Perfil eliminado`)
  }

  return (
    <main className="min-h-screen md:min-w-screen lg:min-w-5xl bg-black p-8 text-white relative">
      <div className="space-y-8">
        <header className="border-b border-white/20 pb-6">
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-white/10 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
          <div className="flex gap-4 w-full justify-between mt-1">
            <h1 className="text-3xl font-bold tracking-tighter">{user?.identities?.[0].identity_data?.display_name}</h1>
          </div>
        </header>

        <section className="space-y-4" aria-label="Profiles List">
          {profiles.map((profile) => (
            <Profile
              key={profile.id}
              profile={profile}
              expand={false}
              onChosen={(e) => { e.stopPropagation(); updateChosenStatus(profile.id, profile); }}
              onDelete={(e) => { e.stopPropagation(); handleDeleteProfile(profile.id); }}
              onSave={(updatedProfile) => updateProfile(updatedProfile)}
            />
          ))}
          <Profile
            profile={{
              id: '',
              profile_title: 'NEW PROFILE',
              profile_description: '',
              data: { ...INITIAL_PROFILE_DATA },
            }}
            expand={true}
            isChosenable={false}
            onSave={(newProfile) => createProfile(newProfile)}
          />
        </section>
      </div>
    </main>
  )
}
