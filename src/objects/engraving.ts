import type { RH } from './user'

export interface EngravingData {
  rh: keyof typeof RH | ''
  idNumber: string
  condition: string
  sosRelationship: string
  sosPhone: string
}

export const INITIAL_ENGRAVING: EngravingData = {
  rh: '',
  idNumber: '',
  condition: '',
  sosRelationship: '',
  sosPhone: '',
}
