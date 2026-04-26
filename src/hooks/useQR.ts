import { ROUTES } from '../constants'

// TODO: this util function shouldn't be a hook
export const useQR = (token?: string): { url: string } => {
  if (!token) return { url: '' }

  const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    `${window.location.origin}/${ROUTES.PUBLIC}/${token}`
  )}&size=${200}x${200}&margin=20&bgcolor=ffffff&format=png&ecc=L`

  return {
    url,
  }
}