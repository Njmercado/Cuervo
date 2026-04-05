import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQR } from '../../hooks/useQR'
import { QR } from './QR'
import { Box, Button } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'

export const QRCard = () => {
  const navigate = useNavigate()
  const { qrCode, generateQR } = useQR()

  useEffect(() => {
    generateQR()
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        mt: 4,
        width: '100%',
        maxWidth: 440,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 4px 20px rgba(0, 110, 42, 0.15)',
      }}
    >
      <QR qrCode={qrCode} />
      <Button
        onClick={() => navigate('/dashboard')}
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<DashboardIcon />}
        sx={{ py: 1.8 }}
      >
        Entrar al Dashboard
      </Button>
    </Box>
  )
}