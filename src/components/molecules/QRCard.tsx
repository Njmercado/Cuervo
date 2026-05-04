import { buildQRUrl } from '../../utils/buildQRUrl'
import { Box, Button, Card, CardContent, Paper, Typography } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import { ROUTES } from '../../constants'
import { useTheme } from '@mui/material/styles'
import { useGetUserQuery } from '../../store/endpoints'

export const QRCard = () => {
  const theme = useTheme()
  const { data: user } = useGetUserQuery()
  const url = user?.username ? buildQRUrl(`${ROUTES.PUBLIC}/${user.username}`) : ''

  const handleShareProfile = (id: string) => {
    window.open(`${ROUTES.PUBLIC}/${id}`, '_blank');
  }

  return (
    <Card sx={{ bgcolor: theme.palette.custom.primary[100] }}>
      <CardContent sx={{
        display: 'grid',
        gridTemplateRows: 'auto 2fr 1fr 1fr ',
        gap: 2
      }}>
        <Typography sx={{
          color: theme.palette.primary.contrastText,
          fontWeight: 700,
          fontSize: theme.customSizes.font.xl,
          textAlign: 'center'
        }}>
          INFORMACION QR
        </Typography>
        {url ? (
          <Box display='flex' alignItems='center' justifyContent='center'>
            <img
              src={url}
              alt="QR Code"
              style={{
                borderRadius: '10px', border: '1px solid white',
                width: '100%', maxWidth: '200px'
              }} />
          </Box>
        ) : (
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Typography sx={{
              color: theme.palette.primary.contrastText,
              fontSize: theme.customSizes.font.lg
            }}>
              No hay QR disponible
            </Typography>
          </Box>
        )}
        <Paper sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)', p: 2, display: 'flex',
          gap: 1, flexDirection: 'column', textAlign: 'center'
        }}>
          <Typography sx={{
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            fontSize: theme.customSizes.font.small
          }}>
            CODIGO BANDA
          </Typography>
          <Typography sx={{
            color: theme.palette.custom.neutral[100],
            fontSize: theme.customSizes.font.lg
          }}>
            {user?.code}
          </Typography>
        </Paper>
        <Button variant='text' sx={{
          color: theme.palette.primary.contrastText, gap: 1,
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            transform: 'scale(1.05)',
            transition: 'all 0.3s ease-in-out',
          }
        }} onClick={() => handleShareProfile(user?.username || '')}>
          <ShareIcon />
          <span>Visitar Perfil Público</span>
        </Button>
      </CardContent>
    </Card>
  )
}