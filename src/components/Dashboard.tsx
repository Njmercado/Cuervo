import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile as ProfileType } from '../objects/profile'
import { useEffect } from 'react'
import { UpdateProfile } from './ui/UpdateProfile'
import { CreateProfile } from './ui/CreateProfile'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Modal } from './ui/Modal'
import { SideDrawer } from './ui/SideDrawer'
import { useQR } from '../hooks/useQR'
import { QR } from './ui/QR'

export function Dashboard() {
  const [showQRModal, setShowQRModal] = useState(false)
  const [showNewProfileDrawer, setShowNewProfileDrawer] = useState(false)
  const { qrCode, generateQR } = useQR()
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
          <div className="flex gap-4 w-full mt-1">
            <h1 className="text-3xl font-bold tracking-tighter">{user?.identities?.[0].identity_data?.display_name}</h1>
            <a
              href={`/public/${user?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold border border-white/20 hover:bg-white text-gray-400 hover:text-black transition-colors uppercase tracking-widest cursor-pointer flex items-center rounded"
            >
              Visitar perfil publico
            </a>
            <button
              onClick={() => setShowNewProfileDrawer(true)}
              className="px-4 py-2 text-xs font-semibold border border-white/20 hover:bg-white text-gray-400 hover:text-black transition-colors uppercase tracking-widest cursor-pointer flex items-center rounded"
            >
              + Nuevo Perfil
            </button>
          </div>
        </header>

        <section className="space-y-4" aria-label="Profiles List">
          {profiles.map((profile) => (
            <UpdateProfile
              key={profile.id}
              profile={profile}
              expand={false}
              onChosen={(e) => { e.stopPropagation(); updateChosenStatus(profile.id, profile); }}
              onDelete={(e) => { e.stopPropagation(); handleDeleteProfile(profile.id); }}
              onSave={(updatedProfile) => updateProfile(updatedProfile)}
            />
          ))}
        </section>
      </div>

      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => {
            generateQR()
            setShowQRModal(true)
          }}
          className="w-16 h-16 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-4 border-black"
          title="Ver mi QR"
        >
          <img src="qr.png" alt="QR Code icon" width="32" height="32" />
        </button>
      </div>

      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="Tu Código QR">
        <QR qrCode={qrCode} />
      </Modal>

      <SideDrawer isOpen={showNewProfileDrawer} onClose={() => setShowNewProfileDrawer(false)} title="Nuevo Perfil">
        <CreateProfile
          onSave={(newProfile: ProfileType) => {
            createProfile(newProfile)
            setShowNewProfileDrawer(false)
          }}
        />
      </SideDrawer>
    </main>
  )
}
