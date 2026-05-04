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
  Stack,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import MedicationIcon from '@mui/icons-material/Medication'
import { useTheme } from '@mui/material/styles'
import type { Condition } from '../../objects/condition'

export interface ConditionCardProps {
  condition: Condition
  onEdit: (condition: Condition) => void
  onDelete: (id: string) => void
}

export function ConditionCard({ condition, onEdit, onDelete }: ConditionCardProps) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const MENU_OPTIONS = [
    {
      label: 'Editar',
      icon: EditIcon,
      onClick: () => { onEdit(condition); setAnchorEl(null) },
    },
    {
      label: 'Eliminar',
      icon: DeleteIcon,
      onClick: () => { onDelete(condition.id); setAnchorEl(null) },
    },
  ]

  return (
    <Card sx={{ bgcolor: condition.is_allergy ? theme.palette.custom.tertiary[20] : theme.palette.background.default }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              p: 2,
              borderRadius: theme.customSizes.radius.md,
              bgcolor: theme.palette.custom.primary[10],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MedicalServicesIcon sx={{ color: theme.palette.custom.primary[100], fontSize: theme.customSizes.font.xl }} />
          </Box>

          {/* Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {condition.title}
              </Typography>
              <Chip label={condition.is_allergy ? 'Alergia' : 'Condición Médica'} size='small' />
            </Box>

            {condition.medicines.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MedicationIcon sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Medicamentos
                  </Typography>
                </Box>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {condition.medicines.map((med, i) => (
                    <Chip
                      key={i}
                      label={med}
                      size="small"
                      sx={{ bgcolor: theme.palette.custom.primary[10], color: theme.palette.custom.primary[100], fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {condition.created_at &&
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                {new Date(condition.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
              </Typography>
            }
          </Box>

          {/* Menu */}
          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              aria-label="más opciones"
              aria-controls={open ? 'condition-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu id="condition-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
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
