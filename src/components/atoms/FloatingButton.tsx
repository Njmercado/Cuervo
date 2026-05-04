import { Box, Fab, alpha } from '@mui/material'

export interface FloatingButtonProps {
  children: React.ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center'
  className?: string
}

const positionStyles: Record<NonNullable<FloatingButtonProps['position']>, object> = {
  'bottom-right': { bottom: 32, right: 32 },
  'bottom-left': { bottom: 32, left: 32 },
  'top-right': { top: 32, right: 32 },
  'top-left': { top: 32, left: 32 },
  'bottom-center': { bottom: 32, left: '50%', transform: 'translateX(-50%)' },
}

export function FloatingButton({
  children,
  onClick,
  position = 'bottom-right',
  className,
}: FloatingButtonProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 40,
        ...positionStyles[position],
      }}
      className={className}
    >
      <Fab
        onClick={onClick}
        sx={{
          bgcolor: 'white',
          color: 'black',
          width: 64,
          height: 64,
          boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.common.white, 0.25)}`,
          border: '4px solid black',
          '&:hover': {
            bgcolor: 'white',
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {children}
      </Fab>
    </Box>
  )
}