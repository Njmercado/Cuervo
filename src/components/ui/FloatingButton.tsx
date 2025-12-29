export interface FloatingButtonProps {
  children: React.ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center'
  className?: string
}

export function FloatingButton({ children, onClick, position = 'bottom-right', className }: FloatingButtonProps) {

  const getPosition = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-8 right-8'
      case 'bottom-left':
        return 'bottom-8 left-8'
      case 'top-right':
        return 'top-8 right-8'
      case 'top-left':
        return 'top-8 left-8'
      case 'bottom-center':
        return 'bottom-8 left-1/2 transform -translate-x-1/2'
    }
  }

  return (
    <div
      onClick={onClick}
      className={
        `flex fixed z-40 w-16 h-16 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-4 border-black 
        ${getPosition()}
        ${className}
      `}
    >
      {children}
    </div>
  )
}