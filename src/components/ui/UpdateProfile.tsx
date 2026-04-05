import { type Profile as ProfileType } from '../../objects/profile'
import { ProfileForm } from './ProfileForm'
import { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Stack,
  alpha,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SaveIcon from '@mui/icons-material/Save'

interface ProfileProps {
  profile: ProfileType
  onChosen?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  onSave: (profile: ProfileType) => void
  isChosenable?: boolean
  expand?: boolean
}

export function UpdateProfile({
  profile,
  onChosen,
  onDelete,
  onSave,
  isChosenable = true,
  expand = false,
}: ProfileProps) {
  const [localProfile, setLocalProfile] = useState(profile)
  const [isExpanded, setIsExpanded] = useState(expand)

  return (
    <Paper
      component="article"
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: localProfile.chosen ? (theme) => alpha(theme.palette.warning.main, 0.5) : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: localProfile.chosen ? '0 4px 20px rgba(0, 200, 83, 0.2)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header / Click to Expand */}
      <Box
        component="header"
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
        sx={{
          p: 3,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          '&:hover': { bgcolor: (theme) => alpha(theme.palette.common.white, 0.03) },
          transition: 'background-color 0.2s',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {isChosenable && (
            <IconButton
              onClick={onChosen}
              size="small"
              sx={{
                color: localProfile.chosen ? 'warning.main' : 'text.disabled',
                '&:hover': { color: 'warning.main', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
              title={localProfile.chosen ? 'Current Profile' : 'Set as Current'}
            >
              {localProfile.chosen ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          )}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: localProfile.chosen ? 'warning.main' : 'text.primary', transition: 'color 0.2s' }}
            >
              {localProfile.profile_title || 'Untitled Profile'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {localProfile.profile_description || 'No description'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {isChosenable && (
            <IconButton
              onClick={onDelete}
              size="small"
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' }, transition: 'color 0.2s' }}
              title="Delete profile"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
          <ExpandMoreIcon
            sx={{
              color: 'text.secondary',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Stack>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={isExpanded}>
        <Box
          sx={{
            p: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <ProfileForm
            profile={localProfile}
            onUpdate={(updated: ProfileType) => setLocalProfile(updated)}
          />
          <Button
            onClick={() => onSave(localProfile)}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<SaveIcon />}
            sx={{ py: 1.8 }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Collapse>
    </Paper>
  )
}
