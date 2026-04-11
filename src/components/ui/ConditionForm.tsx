import { useState, useEffect } from 'react'
import { Box, Button, Chip, Stack, TextField, InputAdornment, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { FormInput } from './FormInput'
import type { Condition, ConditionData } from '../../objects/condition'

export interface ConditionFormProps {
  condition?: Condition
  onSave: (data: ConditionData | Condition) => void
  onCancel: () => void
}

export function ConditionForm({ condition, onSave, onCancel }: ConditionFormProps) {
  const [title, setTitle] = useState(condition?.title ?? '')
  const [medicines, setMedicines] = useState<string[]>(condition?.medicines ?? [])
  const [medicineInput, setMedicineInput] = useState('')

  useEffect(() => {
    setTitle(condition?.title ?? '')
    setMedicines(condition?.medicines ?? [])
    setMedicineInput('')
  }, [condition])

  const handleAddMedicine = () => {
    const trimmed = medicineInput.trim()
    if (trimmed && !medicines.includes(trimmed)) {
      setMedicines((prev) => [...prev, trimmed])
    }
    setMedicineInput('')
  }

  const handleRemoveMedicine = (med: string) => {
    setMedicines((prev) => prev.filter((m) => m !== med))
  }

  const handleMedicineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddMedicine()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (condition?.id) {
      onSave({ ...condition, title, medicines })
    } else {
      onSave({ title, medicines })
    }
  }

  const isValid = title.trim().length > 0

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <FormInput
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Diabetes tipo 2"
      />

      {/* Medicine array input */}
      <TextField
        label="Medicamento"
        value={medicineInput}
        onChange={(e) => setMedicineInput(e.target.value)}
        onKeyDown={handleMedicineKeyDown}
        placeholder="Escribe un medicamento y presiona Enter o +"
        variant="filled"
        fullWidth
        slotProps={{
          inputLabel: { sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' } },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleAddMedicine} disabled={!medicineInput.trim()} size="small" aria-label="Agregar medicamento">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {medicines.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {medicines.map((med) => (
            <Chip
              key={med}
              label={med}
              onDelete={() => handleRemoveMedicine(med)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={!isValid}>
          {condition?.id ? 'Actualizar' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  )
}
