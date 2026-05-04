import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useTheme } from '@mui/material/styles'
import type { SOSContact } from '../../objects/sosContact'

export interface SOSContactCardProps {
  contact: SOSContact
  onEdit: (contact: SOSContact) => void
  onDelete: (id: string) => void
}

export function SOSContactCard({ contact, onEdit, onDelete }: SOSContactCardProps) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const MENU_OPTIONS = [
    {
      label: 'Editar',
      icon: EditIcon,
      onClick: () => { onEdit(contact); setAnchorEl(null) },
    },
    {
      label: 'Eliminar',
      icon: DeleteIcon,
      onClick: () => { onDelete(contact.id); setAnchorEl(null) },
    },
  ]

  const fullPhone = contact.phone_indicative
    ? `${contact.phone_indicative} ${contact.phone_number}`
    : contact.phone_number

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              p: 2,
              borderRadius: theme.customSizes.radius.md,
              bgcolor: theme.palette.custom.tertiary[5],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ContactEmergencyIcon sx={{ color: theme.palette.custom.tertiary[100], fontSize: theme.customSizes.font.xl }} />
          </Box>

          {/* Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {contact.name} {contact.last_name}
            </Typography>

            {contact.relationship && (
              <Chip
                label={contact.relationship}
                size="small"
                sx={{
                  bgcolor: theme.palette.custom.tertiary[20],
                  color: theme.palette.custom.tertiary[100],
                  fontWeight: 600,
                  mb: 1,
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <PhoneIcon sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {fullPhone}
              </Typography>
            </Box>

            {contact.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LocationOnIcon sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {contact.location}
                </Typography>
              </Box>
            )}

            {contact.created_at && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                {new Date(contact.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
              </Typography>
            )}
          </Box>

          {/* Menu */}
          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              aria-label="más opciones"
              aria-controls={open ? 'sos-contact-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu id="sos-contact-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem key={option.label} sx={{ display: 'flex', gap: 1 }} onClick={option.onClick}>
                  <option.icon fontSize="small" />
                  <span>{option.label}</span>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
