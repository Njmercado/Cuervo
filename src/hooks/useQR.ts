import { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"

export const useQR = () => {
  const { user } = useAuth()
  const [qrCode, setQrCode] = useState('')

  const generateQR = (userId?: string) => {
    const targetId = userId || user?.id
    if (!targetId) return ''

    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      `${window.location.origin}/public/${targetId}`
    )}&size=${200}x${200}&bgcolor=ffffff`

    setQrCode(url)
    return url
  }

  return {
    qrCode,
    generateQR
  }
}