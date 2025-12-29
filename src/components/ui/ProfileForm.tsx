import { useEffect, useReducer } from 'react'
import { type Profile as ProfileType, type ProfileData } from '../../objects/profile'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { RH, ID_TYPE } from '../../constants/profile.constant'

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

interface ProfileFormProps {
  profile: ProfileType
  onUpdate: (profile: ProfileType) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [state, dispatch] = useReducer(reducer, profile)

  const rhOptions = Object.values(RH)
  const idTypeOptions = Object.values(ID_TYPE)

  useEffect(() => {
    onUpdate(state);
  }, [state])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Meta Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-lg" aria-label="Profile Metadata">
        <FormInput
          label="Profile Title"
          placeholder="Example 1"
          value={state.profile_title || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_title', value: e.target.value } })}
          onClick={(e) => e.stopPropagation()}
        />
        <FormInput
          label="Description"
          placeholder="Profile Description"
          value={state.profile_description || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_META', payload: { field: 'profile_description', value: e.target.value } })}
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
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { fullName: e.target.value } } })}
            />
            <FormSelect
              label="RH"
              options={rhOptions}
              value={state.data?.rh || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { rh: e.target.value } } })}
              placeholder="Seleccionar RH"
            />
            <FormSelect
              label="Tipo de Documento"
              options={idTypeOptions}
              value={state.data?.idType || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { idType: e.target.value } } })}
              placeholder="Seleccionar Tipo"
            />
            <FormInput
              label="Documento de Identidad"
              value={state.data?.idNumber || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { idNumber: e.target.value } } })}
            />
            <FormInput
              label="Seguro de Salud"
              value={state.data?.healthInsurance || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsurance: e.target.value } } })}
            />
            <FormInput
              label="Numero Seguro (Opcional)"
              value={state.data?.healthInsuranceNumber || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { healthInsuranceNumber: e.target.value } } })}
            />
          </div>
          {/* Extra Info */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Información Extra</label>
            <textarea
              value={state.data?.extraInfo || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { extraInfo: e.target.value } } })}
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
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyName: e.target.value } } })}
            />
            <FormInput
              label="Numero de Contacto"
              type="tel"
              value={state.data?.emergencyContact || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyContact: e.target.value } } })}
            />
            <FormInput
              label="Parentesco"
              value={state.data?.emergencyRelationship || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { data: { emergencyRelationship: e.target.value } } })}
            />
          </div>
        </section>
      </div>
    </div>
  )
}