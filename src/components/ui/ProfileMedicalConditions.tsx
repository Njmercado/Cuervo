import { useEffect, useState } from 'react'
import { Box, Typography, IconButton, Card } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useGetMedicalConditions } from '../../api'
import type { Condition } from '../../objects/condition'
import type { Profile } from '../../objects/profile'

interface ProfileMedicalConditionsProps {
  form: Profile
  setForm: (form: Profile) => void
}

interface LightMedicalConditionCardProps {
  key: string
  condition: Condition
  isChosen: boolean
  onSelect: (id: string) => void
  onDeselect: (id: string) => void
}

/**
 * Component to display and manage medical conditions for a profile.
 * @param form The profile form containing the selected medical conditions.
 * @param setForm Function to update the profile form.
 * @returns A React component.
 */
export function ProfileMedicalConditions({ form, setForm }: ProfileMedicalConditionsProps) {
  const { getConditions } = useGetMedicalConditions()
  const [conditions, setConditions] = useState<Condition[]>([])

  useEffect(() => {
    async function fetchConditions() {
      try {
        const data = await getConditions()
        console.log('CONDITIONS: ', data)
        if (data) setConditions(data)
      } catch (err) {
        console.error('Error fetching conditions', err)
      }
    }
    fetchConditions()
  }, [])

  const selectedIds = form.medical_conditions || []

  const chosenConditions = conditions.filter(c => selectedIds.includes(c.id))
  const availableConditions = conditions.filter(c => !selectedIds.includes(c.id))

  const handleSelect = (id: string) => {
    setForm({
      ...form,
      medical_conditions: [...selectedIds, id]
    })
  }

  const handleDeselect = (id: string) => {
    setForm({
      ...form,
      medical_conditions: selectedIds.filter(val => val !== id)
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {chosenConditions.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
            SELECCIONADOS
          </Typography>
          {chosenConditions.map(condition => <LightMedicalConditionCard key={condition.id} condition={condition} isChosen={true} onSelect={handleSelect} onDeselect={handleDeselect} />)}
        </Box>
      )}

      {availableConditions.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
            {chosenConditions.length > 0 ? "OPCIONES DISPONIBLES" : "ELIGE LAS CONDICIONES"}
          </Typography>
          {availableConditions.map(condition => <LightMedicalConditionCard key={condition.id} condition={condition} isChosen={false} onSelect={handleSelect} onDeselect={handleDeselect} />)}
        </Box>
      )}

      {conditions.length === 0 && (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          No tienes condiciones médicas registradas en tu cuenta.
        </Typography>
      )}
    </Box>
  )
}

/**
 * Component to display a lightweight medical condition card to be chosen.
 * @param key 
 * @param condition medical condition general information
 * @param isChosen boolean to define if this condition is one of the chosen ones
 * @param onSelect function to select a condition
 * @param onDeselect function to deselect a condition
 * @returns A React component.
 */
function LightMedicalConditionCard({ key, condition, isChosen, onSelect, onDeselect }: LightMedicalConditionCardProps) {
  return (
    <Card
      key={key}
      sx={{
        bgcolor: theme => condition.is_allergy ? theme.palette.custom.tertiary[20] : theme.palette.background.default,
        border: theme => `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        mb: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, px: 2 }}>
        <Typography variant="body2" fontWeight={600}>{condition.title}</Typography>
        <IconButton
          size="small"
          color={isChosen ? "error" : "primary"}
          onClick={() => isChosen ? onDeselect(condition.id) : onSelect(condition.id)}
        >
          {isChosen ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Card>
  )
}