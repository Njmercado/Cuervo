import { useReducer } from 'react'
import { type Profile, type ProfileData } from '../objects/profile'

type ProfileAction =
  | { type: 'ADD_PROFILE'; payload: Profile }
  | { type: 'REMOVE_PROFILE'; payload: { id?: string }; index?: number }
  | { type: 'TOGGLE_PROFILE'; payload: { id?: string }; index?: number }
  | { type: 'ACTIVATE_PROFILE'; payload: { id?: string }; index?: number }
  | { type: 'UPDATE_PROFILE_META'; payload: { id?: string; field: 'profile_title' | 'profile_description'; value: string }; index?: number }
  | { type: 'UPDATE_PROFILE_DATA'; payload: { id?: string; data: Partial<ProfileData> }; index?: number }
  | { type: 'SET_PROFILES'; payload: Profile[] }

const INITIAL_PROFILE_DATA: ProfileData = {
  fullName: '',
  rh: '',
  idType: '',
  idNumber: '',
  healthInsurance: '',
  healthInsuranceNumber: '',
  extraInfo: '',
  emergencyName: '',
  emergencyContact: '',
  emergencyRelationship: ''
}

const profileReducer = (state: Profile[], action: ProfileAction): Profile[] => {
  switch (action.type) {
    case 'ADD_PROFILE':
      return [...state, action.payload]
    case 'REMOVE_PROFILE':
      return state.filter((p, profileIndex) => p.id != action.payload?.id || profileIndex != action.index)
    case 'TOGGLE_PROFILE':
      return state.map((p, profileIndex) =>
        p.id === action.payload?.id || profileIndex === action.index ? { ...p, isExpanded: !p.isExpanded } : p
      )
    case 'ACTIVATE_PROFILE':
      return state.map((p, profileIndex) =>
        p.id === action.payload?.id || profileIndex === action.index ? { ...p, chosen: true } : { ...p, chosen: false }
      )
    case 'UPDATE_PROFILE_META':
      return state.map((p, profileIndex) => {
        if (p.id === action.payload.id || (action.payload.id === undefined && profileIndex === action.index)) {
          return { ...p, [action.payload.field]: action.payload.value }
        }
        return p
      })
    case 'UPDATE_PROFILE_DATA':
      return state.map((p, profileIndex) => {
        if (p.id === action.payload.id || (action.payload.id === undefined && profileIndex === action.index)) {
          return { ...p, data: { ...p.data, ...action.payload.data } }
        }
        return p
      })
    case 'SET_PROFILES':
      return action.payload
    default:
      return state
  }
}

export function useProfiles() {
  const [profiles, dispatch] = useReducer(profileReducer, [])

  const loadProfiles = (profiles: Profile[]) => {
    dispatch({ type: 'SET_PROFILES', payload: profiles })
  }

  const addProfile = () => {
    // Collapse others
    dispatch({ type: 'SET_PROFILES', payload: profiles.map(p => ({ ...p, isExpanded: false })) })

    dispatch({
      type: 'ADD_PROFILE',
      payload: {
        profile_title: '',
        profile_description: '',
        data: { ...INITIAL_PROFILE_DATA },
        isExpanded: true,
        chosen: false
      }
    })
  }

  const removeProfile = (id: string | undefined, index: number) => {
    dispatch({ type: 'REMOVE_PROFILE', payload: { id }, index })
  }

  const toggleProfile = (id: string | undefined, index: number) => {
    dispatch({ type: 'TOGGLE_PROFILE', payload: { id }, index })
  }

  const activateProfile = (id: string | undefined, index: number) => {
    if (!id) {
      dispatch({ type: 'ACTIVATE_PROFILE', payload: {}, index })
      return
    }
    dispatch({ type: 'ACTIVATE_PROFILE', payload: { id } })
  }

  const updateProfileMeta = (id: string | undefined, index: number, field: 'profile_title' | 'profile_description', value: string) => {
    dispatch({ type: 'UPDATE_PROFILE_META', payload: { id, field, value }, index })
  }

  const updateProfileData = (id: string | undefined, index: number, field: keyof ProfileData, value: string) => {
    dispatch({ type: 'UPDATE_PROFILE_DATA', payload: { id, data: { [field]: value } }, index })
  }

  return {
    profiles,
    loadProfiles,
    addProfile,
    removeProfile,
    toggleProfile,
    activateProfile,
    updateProfileMeta,
    updateProfileData
  }
}
