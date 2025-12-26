import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../hooks/useProfiles'
import { type Profile } from '../objects/profile'
import { FormInput } from './ui/FormInput'
import { FormSelect } from './ui/FormSelect'
import { RH, ID_TYPE } from '../constants/profile.constant'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (!user) return
    supabase.from('PublicUser').select('*').eq('user_id', user.id).then(({ data }) => {
      loadProfiles(data ?? []);
    })
  }, [user?.id])

  const createProfile = async (profile: Profile) => {
    // Only used for UI feedback here, real logic handles simulation/db
    // In a real app this would probably be in the hook or a separate service
    const { id, isExpanded, chosen, ...dataToSave } = profile

    // Simulate Supabase Upsert
    const { error } = await supabase.from('PublicUser').insert({
      profile_description: profile.profile_description,
      profile_title: profile.profile_title,
      data: profile.data,
      chosen: profile.chosen,
      user_id: user?.id
    });

    if (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile')
      return
    }

    console.log(`Saving profile ${id} to DB:`, dataToSave)
    alert(`Cambios guardados para: ${profile.profile_title}`)
  }

  const updateProfile = async (profile: Profile) => {
    const { id, isExpanded, chosen, ...dataToSave } = profile

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
      alert('Error updating profile')
      return
    }

    console.log(`Updating profile ${id} to DB:`, dataToSave)
    alert(`Cambios guardados para: ${profile.profile_title}`)
  }

  const updateChosenStatus = async (id: string, profile: Profile) => {
    const { error } = await supabase
      .from('PublicUser')
      .update({ chosen: true })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
      return
    }

    alert(`Cambios guardados para: ${profile.profile_title}`)
  }

  const handleUpdateChosenStatus = async (id: string | undefined, index: number, profile: Profile) => {
    activateProfile(profile.id, index)
    if (!id) return
    updateChosenStatus(id, profile)
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-white/10 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="space-y-4" aria-label="Profiles List">
          {profiles.map((profile, index) => (
            <article
              key={profile.id || index}
              className={`bg-[#0a0a0a] border ${profile.chosen ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'} rounded-xl overflow-hidden transition-all duration-300`}
            >
              {/* Header / Click to Expand */}
              <header
                onClick={() => toggleProfile(profile.id, index)}
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center group select-none"
              >
                <div className="flex items-center gap-4">
                  {/* Star Icon for Active Status */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleUpdateChosenStatus(profile.id, index, profile); }}
                    className={`text-2xl transition-colors hover:scale-110 active:scale-95 ${profile.chosen ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500/50'}`}
                    title={profile.chosen ? "Current Profile" : "Set as Current"}
                  >
                    ★
                  </button>
                  <div className="space-y-1">
                    <h3 className={`text-lg font-bold transition-colors ${profile.chosen ? 'text-yellow-500' : 'group-hover:text-blue-400'}`}>
                      {profile.profile_title || 'Untitled Profile'}
                    </h3>
                    <p className="text-sm text-gray-500">{profile.profile_description || 'No description'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeProfile(profile.id, index); }}
                    className="text-gray-600 hover:text-red-500 transition-colors px-2 py-1 text-xs uppercase tracking-widest font-bold z-10"
                  >
                    Delete
                  </button>
                  <span className={`text-gray-400 transition-transform duration-300 ${profile.isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </header>

              {/* Collapsible Content */}
              {profile.isExpanded && (
                <div className="p-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-8">
                    {/* Meta Info */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-lg" aria-label="Profile Metadata">
                      <FormInput
                        label="Profile Title"
                        placeholder="Example 1"
                        value={profile.profile_title || ''}
                        onChange={(e) => updateProfileMeta(profile.id, index, 'profile_title', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <FormInput
                        label="Description"
                        placeholder="Profile Description"
                        value={profile.profile_description || ''}
                        onChange={(e) => updateProfileMeta(profile.id, index, 'profile_description', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </section>

                    <div className="space-y-12">
                      {/* Personal Info */}
                      <section className="space-y-6" aria-label="Personal Information">
                        <h2 className="text-lg font-semibold border-b border-white/10 pb-2 uppercase tracking-wide text-gray-400">
                          Información Personal
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Nombre Completo"
                            value={profile.data?.fullName || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'fullName', e.target.value)}
                          />
                          <FormSelect
                            label="RH"
                            options={Object.values(RH)}
                            value={profile.data?.rh || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'rh', e.target.value)}
                            placeholder="Seleccionar RH"
                          />
                          <FormSelect
                            label="Tipo de Documento"
                            options={Object.values(ID_TYPE)}
                            value={profile.data?.idType || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'idType', e.target.value)}
                            placeholder="Seleccionar Tipo"
                          />
                          <FormInput
                            label="Documento de Identidad"
                            value={profile.data?.idNumber || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'idNumber', e.target.value)}
                          />
                          <FormInput
                            label="Seguro de Salud"
                            value={profile.data?.healthInsurance || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'healthInsurance', e.target.value)}
                          />
                          <FormInput
                            label="Numero Seguro (Opcional)"
                            value={profile.data?.healthInsuranceNumber || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'healthInsuranceNumber', e.target.value)}
                          />
                        </div>
                        {/* Extra Info */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Información Extra</label>
                          <textarea
                            value={profile.data?.extraInfo || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'extraInfo', e.target.value)}
                            className="w-full bg-black text-white border border-white/20 focus:border-white px-4 py-3 outline-none transition-colors min-h-[100px]"
                          />
                        </div>
                      </section>

                      {/* Emergency Info */}
                      <section className="space-y-6" aria-label="Emergency Information">
                        <h2 className="text-lg font-semibold border-b border-white/10 pb-2 uppercase tracking-wide text-gray-400">
                          Información de Emergencia
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Nombre Completo"
                            value={profile.data?.emergencyName || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'emergencyName', e.target.value)}
                          />
                          <FormInput
                            label="Numero de Contacto"
                            type="tel"
                            value={profile.data?.emergencyContact || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'emergencyContact', e.target.value)}
                          />
                          <FormInput
                            label="Parentesco"
                            value={profile.data?.emergencyRelationship || ''}
                            onChange={(e) => updateProfileData(profile.id, index, 'emergencyRelationship', e.target.value)}
                          />
                        </div>
                      </section>
                    </div>

                    {/* Individual Save Button */}

                    {
                      profile.id !== undefined ? (
                        <button
                          onClick={() => updateProfile(profile)}
                          className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
                        >
                          Guardar Cambios
                        </button>
                      ) : (
                        <button
                          onClick={() => createProfile(profile)}
                          className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
                        >
                          Crear Perfil
                        </button>
                      )
                    }
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
