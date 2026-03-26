import { type ComponentProps } from 'react'
import { TextField } from '@mui/material'
import { type SxProps, type Theme } from '@mui/material'

interface FormInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  label: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  textarea?: boolean
  sx?: SxProps<Theme>
}

export function FormInput({ label, value, onChange, onClick, type = 'text', placeholder, disabled = false, textarea = false, sx, ...props }: FormInputProps) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
      placeholder={placeholder}
      fullWidth
      variant="filled"
      disabled={disabled}
      multiline={textarea}
      minRows={3}
      slotProps={{
        inputLabel: {
          sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' },
        },
        htmlInput: { props }
      }}
      sx={sx}
    />
  )
}
