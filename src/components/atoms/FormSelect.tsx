import { type ComponentProps } from 'react'
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material'

interface Option {
  label: string
  value: string
}

interface FormSelectProps extends Omit<ComponentProps<'select'>, 'onChange'> {
  options: (string | Option)[]
  placeholder?: string
  label?: string
  onChange?: (e: SelectChangeEvent<string>) => void
}

export function FormSelect({ label, options, placeholder = 'Select an option', value, onChange }: FormSelectProps) {
  return (
    <FormControl fullWidth variant="filled">
      {label && <InputLabel sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }}>{label}</InputLabel>}
      <Select
        value={(value as string) || ''}
        onChange={onChange}
        label={label}
        displayEmpty
      >
        <MenuItem value="" disabled>{placeholder}</MenuItem>
        {options.map((opt) => {
          const optLabel = typeof opt === 'string' ? opt : opt.label
          const optValue = typeof opt === 'string' ? opt : opt.value
          return (
            <MenuItem key={optValue} value={optValue}>
              {optLabel}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
