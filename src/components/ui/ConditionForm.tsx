import { useState, useEffect } from 'react'
import { Box, Button, Chip, Stack, TextField, InputAdornment, IconButton, Switch, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { FormInput } from './FormInput'
import type { Condition, ConditionData } from '../../objects/condition'

export interface ConditionFormProps {
  condition?: Condition
  onSave: (data: ConditionData) => void
  onUpdate?: (data: Condition) => void
  onCancel: () => void
}

const EMPTY_CONDITION: ConditionData = {
  title: '',
  medicines: [],
  is_allergy: false,
}

export function ConditionForm({ condition, onSave, onUpdate, onCancel }: ConditionFormProps) {
  const [medicineInput, setMedicineInput] = useState<string>('');
  const [form, setForm] = useState<ConditionData>(EMPTY_CONDITION);

  useEffect(() => {
    if (condition) {
      setForm(condition)
    } else {
      setForm(EMPTY_CONDITION)
    }
  }, [condition])

  const handleAddMedicine = () => {
    const trimmed = medicineInput.trim()
    if (trimmed && !form?.medicines?.includes(trimmed)) {
      if (form?.medicines) {
        setForm({ ...form, medicines: [...form?.medicines, trimmed] } as Condition)
      } else {
        setForm({ ...form, medicines: [trimmed] } as Condition)
      }
    }
    setMedicineInput('')
  }

  const handleRemoveMedicine = (med: string) => {
    setForm({ ...form, medicines: form?.medicines?.filter((m) => m !== med) || [] } as Condition)
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
      onUpdate?.({ ...condition, ...form } as Condition)
    } else {
      onSave({ ...form })
    }
  }

  const isValid = form?.title && form.title.trim().length > 0

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <FormInput
        label="Título"
        value={form?.title}
        onChange={(value) => setForm({ ...form, title: value } as Condition)}
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

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {form?.medicines?.map((med) => (
          <Chip
            key={med}
            label={med}
            onDelete={() => handleRemoveMedicine(med)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>

      {/* Is allergy toggle */}
      <Box component='section' display='flex' flexDirection='row' alignItems='center' gap={2}>
        <Typography>Es una alergia?</Typography>
        <Switch
          value={form?.is_allergy}
          checked={form?.is_allergy}
          onChange={(e) => setForm({ ...form, is_allergy: e.target.checked } as Condition)}
          name="is_allergy"
          color="primary"
        />
      </Box>

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
