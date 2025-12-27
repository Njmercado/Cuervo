import { type Profile as ProfileType, type ProfileData } from '../objects/profile'
import { FormInput } from './ui/FormInput'
import { FormSelect } from './ui/FormSelect'
import { RH, ID_TYPE } from '../constants/profile.constant'
import { useReducer, useState, useEffect } from 'react'

type ProfileAction =
  | { type: 'UPDATE_PROFILE_META'; payload: { id?: string; field: 'profile_title' | 'profile_description'; value: string }; index?: number }
  | { type: 'UPDATE_PROFILE_DATA'; payload: { id?: string; data: Partial<ProfileData> }; index?: number }
  | { type: 'UPDATE'; payload: ProfileType }

const reducer = (state: ProfileType, action: ProfileAction): ProfileType => {
  switch (action.type) {
    case 'UPDATE_PROFILE_META':
      return { ...state, [action.payload.field]: action.payload.value }
    case 'UPDATE_PROFILE_DATA':
      return { ...state, data: { ...state.data, ...action.payload.data } }
    case 'UPDATE':
      return action.payload
    default:
      return state
  }
}

interface ProfileProps {
  profile: ProfileType
  onChosen?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  onSave: (profile: ProfileType) => void
  isChosenable?: boolean
  expand?: boolean
}

export function Profile({
  profile,
  onChosen,
  onDelete,
  onSave,
  isChosenable = true,
  expand = false,
}: ProfileProps) {
  const [state, dispatch] = useReducer(reducer, profile)
  const [isExpanded, setIsExpanded] = useState(expand)
  const rhOptions = Object.values(RH)
  const idTypeOptions = Object.values(ID_TYPE)

  useEffect(() => {
    dispatch({ type: 'UPDATE', payload: profile })
  }, [profile])

  const onUpdateMeta = (field: 'profile_title' | 'profile_description', value: string) => {
    dispatch({ type: 'UPDATE_PROFILE_META', payload: { field, value } })
  }

  const onUpdateData = (data: Partial<ProfileData>) => {
    dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data } })
  }

  return (
    <article
      className={`bg-[#0a0a0a] border ${state.chosen ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'} rounded-xl overflow-hidden transition-all duration-300`}
    >
      {/* Header / Click to Expand */}
      <header
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center group select-none"
      >
        <div className="flex items-center gap-4">
          {
            isChosenable &&
            <button
              onClick={onChosen}
              className={`text-2xl transition-colors hover:scale-110 active:scale-95 ${state.chosen ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500/50'}`}
              title={state.chosen ? "Current Profile" : "Set as Current"}
            >
              ★
            </button>
          }
          <div className="space-y-1">
            <h3 className={`text-lg font-bold transition-colors ${state.chosen ? 'text-yellow-500' : 'group-hover:text-blue-400'}`}>
              {state.profile_title || 'Untitled Profile'}
            </h3>
            <p className="text-sm text-gray-500">{state.profile_description || 'No description'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {
            isChosenable &&
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-500 transition-colors px-2 py-1 text-xs uppercase tracking-widest font-bold z-10"
            >
              Delete
            </button>
          }
          <span className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </header>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-8">
            {/* Meta Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-lg" aria-label="Profile Metadata">
              <FormInput
                label="Profile Title"
                placeholder="Example 1"
                value={state.profile_title || ''}
                onChange={(e) => onUpdateMeta('profile_title', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <FormInput
                label="Description"
                placeholder="Profile Description"
                value={state.profile_description || ''}
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
                    value={state.data?.fullName || ''}
                    onChange={(e) => onUpdateData({ fullName: e.target.value })}
                  />
                  <FormSelect
                    label="RH"
                    options={rhOptions}
                    value={state.data?.rh || ''}
                    onChange={(e) => onUpdateData({ rh: e.target.value })}
                    placeholder="Seleccionar RH"
                  />
                  <FormSelect
                    label="Tipo de Documento"
                    options={idTypeOptions}
                    value={state.data?.idType || ''}
                    onChange={(e) => onUpdateData({ idType: e.target.value })}
                    placeholder="Seleccionar Tipo"
                  />
                  <FormInput
                    label="Documento de Identidad"
                    value={state.data?.idNumber || ''}
                    onChange={(e) => onUpdateData({ idNumber: e.target.value })}
                  />
                  <FormInput
                    label="Seguro de Salud"
                    value={state.data?.healthInsurance || ''}
                    onChange={(e) => onUpdateData({ healthInsurance: e.target.value })}
                  />
                  <FormInput
                    label="Numero Seguro (Opcional)"
                    value={state.data?.healthInsuranceNumber || ''}
                    onChange={(e) => onUpdateData({ healthInsuranceNumber: e.target.value })}
                  />
                </div>
                {/* Extra Info */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Información Extra</label>
                  <textarea
                    value={state.data?.extraInfo || ''}
                    onChange={(e) => onUpdateData({ extraInfo: e.target.value })}
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
                    value={state.data?.emergencyName || ''}
                    onChange={(e) => onUpdateData({ emergencyName: e.target.value })}
                  />
                  <FormInput
                    label="Numero de Contacto"
                    type="tel"
                    value={state.data?.emergencyContact || ''}
                    onChange={(e) => onUpdateData({ emergencyContact: e.target.value })}
                  />
                  <FormInput
                    label="Parentesco"
                    value={state.data?.emergencyRelationship || ''}
                    onChange={(e) => onUpdateData({ emergencyRelationship: e.target.value })}
                  />
                </div>
              </section>
            </div>

            {/* Individual Save Button */}
            <button
              onClick={() => onSave(state)}
              className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer shadow-lg"
            >
              {state.id ? 'Guardar Cambios' : 'Crear Perfil'}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
