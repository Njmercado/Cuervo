export interface QRProps {
  qrCode: string
}

export const QR = ({ qrCode }: QRProps) => {

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="relative group mx-auto w-48 h-48 bg-white p-2 rounded-lg">
        <div className="absolute inset-0 bg-white blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <img
          src={qrCode}
          alt="Tu clave QR personal"
          className="w-full h-full object-contain relative z-10"
        />
      </div>

      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        Escanea este código para acceder instantáneamente a tu perfil público.
      </p>

      <button
        onClick={downloadImage}
        className="text-gray-500 font-bold py-4 px-6 hover:text-white transition-colors duration-300 tracking-widest text-sm cursor-pointer"
      >
        Descargar QR
      </button>
    </div>
  )
}