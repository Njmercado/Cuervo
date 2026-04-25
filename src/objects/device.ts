export type DeviceType = 'Band' | 'Neckle' | 'Tag'

export interface DeviceData {
  user_id: string
  username?: string | null
  public_username?: string | null
  type: DeviceType | string
}

export interface Device extends DeviceData {
  id: number
  created_at: string
  updated_at: string
  device_id: string
  code: number
}
