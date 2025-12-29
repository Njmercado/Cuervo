import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function SideDrawer({ isOpen, onClose, children, title }: SideDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click handler - optional, keeping it transparent essentially since div covers full screen */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={drawerRef}
        className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
          <h3 className="text-xl font-bold text-white tracking-wide uppercase">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>
        <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
