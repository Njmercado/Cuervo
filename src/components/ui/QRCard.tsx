import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQR } from '../../hooks/useQR'
import { QR } from './QR'

export const QRCard = () => {
  const navigate = useNavigate()
  const { qrCode, generateQR } = useQR()

  useEffect(() => {
    generateQR()
  }, [])

  return (
    <div className="mt-8">
      <QR qrCode={qrCode} />
      <button
        onClick={() => navigate('/dashboard')}
        className="w-full bg-white text-black font-bold py-4 px-6 hover:bg-gray-200 transition-colors duration-300 uppercase tracking-widest text-sm cursor-pointer"
      >
        Entrar al Dashboard
      </button>
    </div>
  )
}