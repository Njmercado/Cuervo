import { useEffect } from 'react'
import { useQR } from '../../hooks/useQR'
import { Box, Button, Card, CardContent, Paper, Typography } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import { ROUTES } from '../../constants'
import { useTheme } from '@mui/material/styles'
import { useGetUserQuery } from '../../store/endpoints/usersApi'

export const QRCard = () => {
  const theme = useTheme()
  const { qrCode, generateQR } = useQR()
  const { data: user } = useGetUserQuery()

  useEffect(() => {
    generateQR()
  }, [])

  const handleShareProfile = (id: string) => {
    window.open(`${ROUTES.PUBLIC}/${id}`, '_blank');
  }

  return (
    <Card sx={{ bgcolor: theme.palette.custom.primary[100] }}>
      <CardContent sx={{ display: 'grid', gridTemplateRows: 'auto auto auto auto', gap: 2 }}>
        <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.xl, textAlign: 'center' }}>INFORMACION QR</Typography>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <img src={qrCode} alt="QR Code" style={{ borderRadius: '10px', border: '1px solid white', width: '100%', maxWidth: '200px' }} />
        </Box>
        <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 2, display: 'flex', gap: 1, flexDirection: 'column', textAlign: 'center' }}>
          <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: theme.customSizes.font.small }}>ID BANDA</Typography>
          {/* TODO: Add band id, this current one is just for testing */}
          <Typography sx={{ color: theme.palette.custom.neutral[100], fontSize: theme.customSizes.font.lg }}>KGD-772-NM</Typography>
        </Paper>
        <Button variant='text' sx={{
          color: theme.palette.primary.contrastText,
          gap: 1,
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            transform: 'scale(1.05)',
            transition: 'all 0.3s ease-in-out',
          }
        }} onClick={() => handleShareProfile(user?.user_id || '')}>
          <ShareIcon />
          <span>Visitar Perfil Público</span>
        </Button>
      </CardContent>
    </Card>
  )
}