import { useState } from 'react';
import { Menu, MenuItem, Paper, Card, CardContent, CardActionArea, Typography, Button, IconButton, Box } from "@mui/material"
import type { Profile } from "../../objects/profile"
import ShieldIcon from '@mui/icons-material/Shield'
import EditIcon from '@mui/icons-material/Edit'
import AutoRenewIcon from '@mui/icons-material/AutoRenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles'

export interface ProfileCardProps {
  profile: Profile
  onEdit: (profile: Profile) => void
  onDelete: (id: string) => void
  onSelect?: (id: string) => void
}

export function ProfileCard({ profile, onEdit, onDelete, onSelect }: ProfileCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const MENU_OPTIONS = [
    {
      label: 'Editar',
      icon: EditIcon,
      onClick: (profile: Profile) => onEdit(profile)
    },
    {
      label: 'Eliminar',
      icon: DeleteIcon,
      onClick: (profile: Profile) => onDelete(profile.id)
    }
  ]

  const options = () => {
    return (
      <>
        <IconButton
          aria-label='more options'
          aria-controls={open ? 'menu-options' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='menu-options'
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          {
            MENU_OPTIONS.map((option) => (
              <MenuItem
                sx={{ display: 'flex', gap: 1 }}
                onClick={() => {
                  option.onClick(profile)
                  setAnchorEl(null)
                }}
              >
                <option.icon />
                <span>{option.label}</span>
              </MenuItem>
            ))
          }
        </Menu>
      </>
    );
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 500 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: theme.palette.custom.secondary[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon sx={{ fontSize: theme.customSizes.font.h1, color: theme.palette.custom.primary[100] }} />
            </Paper>
            <Box>
              {options()}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="h5" fontWeight={700}>{profile.profile_title}</Typography>
            <Typography variant="body2">{profile.profile_description}</Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2, px: 2 }}>
        <Button variant="text" color="success" onClick={() => onSelect?.(profile.id)}>
          <AutoRenewIcon />
          <span>Activar este perfil</span>
        </Button>
      </CardActionArea>
    </Card>
  )
}