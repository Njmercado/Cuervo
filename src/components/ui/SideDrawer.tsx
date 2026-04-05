import { useEffect } from 'react'
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { SxProps, Theme } from '@mui/material/styles'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  direction?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  permanent?: boolean
  sx?: SxProps<Theme>
}

export function SideDrawer({ isOpen, onClose, children, direction = 'right', title, size, permanent, sx }: SideDrawerProps) {
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

  function getDrawer(children: React.ReactNode) {
    return (
      <Drawer
        anchor={direction}
        open={isOpen}
        onClose={onClose}
        variant={permanent ? 'permanent' : 'temporary'}
        slotProps={{
          paper: {
            sx: {
              width: () => {
                switch (size) {
                  case 'small':
                    return 400
                  case 'medium':
                    return 600
                  case 'large':
                    return 800
                  case 'xlarge':
                    return '70%'
                  default:
                    return { xs: '100%', sm: 400, md: 600, lg: 800, xl: '70%' }
                }
              },
            }
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
        sx={sx}
      >
        {/* Sticky header */}
        {!permanent && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 2,
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
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: (theme) => theme.palette.custom.neutral[90] } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />
          </>
        )}

        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {children}
        </Box>
      </Drawer>
    )
  }

  return getDrawer(children)
}
