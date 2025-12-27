import { type Profile as ProfileType, type ProfileData } from '../objects/profile'
import { FormInput } from './ui/FormInput'
import { FormSelect } from './ui/FormSelect'
import { RH, ID_TYPE } from '../constants/profile.constant'

interface ProfileProps {
  profile: ProfileType
  index: number // Used for hook updates if ID is missing (new profiles)
  onToggle: () => void
  onActivate: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  onUpdateMeta: (field: 'profile_title' | 'profile_description', value: string) => void
  onUpdateData: (field: keyof ProfileData, value: string) => void
  onSave: () => void
}

export function Profile({
  profile,
  onToggle,
  onActivate,
  onDelete,
  onUpdateMeta,
  onUpdateData,
  onSave
}: ProfileProps) {

  const rhOptions = Object.values(RH)
  const idTypeOptions = Object.values(ID_TYPE)

  return (
    <article
      className={`bg-[#0a0a0a] border ${profile.chosen ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'} rounded-xl overflow-hidden transition-all duration-300`}
    >
      {/* Header / Click to Expand */}
      <header
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center group select-none"
      >
        <div className="flex items-center gap-4">
          {/* Star Icon for Active Status */}
          <button
            onClick={onActivate}
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
            onClick={onDelete}
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
                onChange={(e) => onUpdateMeta('profile_title', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <FormInput
                label="Description"
                placeholder="Profile Description"
                value={profile.profile_description || ''}
                onChange={(e) => onUpdateMeta('profile_description', e.target.value)}
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
                    onChange={(e) => onUpdateData('fullName', e.target.value)}
                  />
                  <FormSelect
                    label="RH"
                    options={rhOptions}
                    value={profile.data?.rh || ''}
                    onChange={(e) => onUpdateData('rh', e.target.value)}
                    placeholder="Seleccionar RH"
                  />
                  <FormSelect
                    label="Tipo de Documento"
                    options={idTypeOptions}
                    value={profile.data?.idType || ''}
                    onChange={(e) => onUpdateData('idType', e.target.value)}
                    placeholder="Seleccionar Tipo"
                  />
                  <FormInput
                    label="Documento de Identidad"
                    value={profile.data?.idNumber || ''}
                    onChange={(e) => onUpdateData('idNumber', e.target.value)}
                  />
                  <FormInput
                    label="Seguro de Salud"
                    value={profile.data?.healthInsurance || ''}
                    onChange={(e) => onUpdateData('healthInsurance', e.target.value)}
                  />
                  <FormInput
                    label="Numero Seguro (Opcional)"
                    value={profile.data?.healthInsuranceNumber || ''}
                    onChange={(e) => onUpdateData('healthInsuranceNumber', e.target.value)}
                  />
                </div>
                {/* Extra Info */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Información Extra</label>
                  <textarea
                    value={profile.data?.extraInfo || ''}
                    onChange={(e) => onUpdateData('extraInfo', e.target.value)}
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
                    onChange={(e) => onUpdateData('emergencyName', e.target.value)}
                  />
                  <FormInput
                    label="Numero de Contacto"
                    type="tel"
                    value={profile.data?.emergencyContact || ''}
                    onChange={(e) => onUpdateData('emergencyContact', e.target.value)}
                  />
                  <FormInput
                    label="Parentesco"
                    value={profile.data?.emergencyRelationship || ''}
                    onChange={(e) => onUpdateData('emergencyRelationship', e.target.value)}
                  />
                </div>
              </section>
            </div>

            {/* Individual Save Button */}
            <button
              onClick={onSave}
              className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
            >
              {profile.id ? 'Guardar Cambios' : 'Crear Perfil'}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
