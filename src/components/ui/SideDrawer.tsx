import { useEffect } from 'react'
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function SideDrawer({ isOpen, onClose, children, title }: SideDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400, md: 600, lg: 800, xl: '50%' },
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Sticky header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Cerrar panel"
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.08)' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
        {children}
      </Box>
    </Drawer>
  )
}
