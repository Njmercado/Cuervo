import { Box, Button, Chip, Typography, useTheme, Card, CardContent, Divider, Paper } from "@mui/material"
import type { Profile } from "../../objects/profile"
import EditIcon from '@mui/icons-material/Edit'
import ShieldIcon from '@mui/icons-material/Shield'

export interface ProfileChosenCardProps {
  profile: Profile
  onEdit: (profile: Profile) => void
}

export function ProfileChosenCard({ profile, onEdit }: ProfileChosenCardProps) {
  const theme = useTheme();
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: theme.palette.custom.secondary[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldIcon sx={{ fontSize: theme.customSizes.font.h1, color: theme.palette.custom.primary[100] }} />
          </Paper>
          <Chip label="Perfil Principal Acivado" color="success" />
        </Box>
        <Box mt={10}>
          <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
            Perfil Principal ({profile.profile_title})
          </Typography>
          <Typography variant='h6' sx={{ maxWidth: '50%', wordBreak: 'break-word', mt: 2 }}>
            Este es el perfil configurado para situaciones de emergencia críticas. Incluye contactos de red primaria.
          </Typography>
        </Box>
      </CardContent>
      <Divider sx={{ borderColor: theme.palette.custom.neutral[100], }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box>
          <Button variant='text' sx={{ color: theme.palette.custom.primary[100], gap: 1 }} onClick={() => onEdit(profile)}>
            <EditIcon />
            <span>Editar</span>
          </Button>
        </Box>
        <Typography>
          ULTIMA MODIFICACION: {new Date(profile.updated_at || '').toLocaleDateString()}
        </Typography>
      </Box>
    </Card>
  )
}