import { useReducer } from 'react'
import { type Profile } from '../objects/profile'

type ProfileAction =
  | { type: 'REMOVE_PROFILE'; payload: { id: string } }
  | { type: 'SET_PROFILES'; payload: Profile[] }
  | { type: 'CHOOSE_PROFILE'; payload: { id: string } }

const profileReducer = (state: Profile[], action: ProfileAction): Profile[] => {
  switch (action.type) {
    case 'REMOVE_PROFILE':
      return state.filter((p) => p.id != action.payload.id)
    case 'SET_PROFILES':
      return action.payload
    case 'CHOOSE_PROFILE':
      return state.map((p) =>
        p.id == action.payload.id ? { ...p, chosen: true } : { ...p, chosen: false }
      )
    default:
      return state
  }
}

export function useProfiles() {
  const [profiles, dispatch] = useReducer(profileReducer, [])

  const loadProfiles = (profiles: Profile[]) => {
    dispatch({ type: 'SET_PROFILES', payload: profiles })
  }

  const removeProfile = (id: string) => {
    dispatch({ type: 'REMOVE_PROFILE', payload: { id } })
  }

  const chooseProfile = (id: string) => {
    dispatch({ type: 'CHOOSE_PROFILE', payload: { id } })
  }

  return {
    profiles,
    loadProfiles,
    removeProfile,
    chooseProfile,
  }
}
