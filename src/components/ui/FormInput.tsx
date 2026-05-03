import { type ComponentProps, useState } from 'react'
import { TextField, FormHelperText, FormLabel, Box } from '@mui/material'
import { type SxProps, type Theme } from '@mui/material'

export interface Rule {
  validate: (value: any) => boolean
  errorMessage?: string
}

interface FormInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  label?: string
  onChange?: (value: string, error?: boolean) => void
  disabled?: boolean
  textarea?: boolean
  sx?: SxProps<Theme>
  rules?: Rule[]
  isValid?: (valid: boolean, messages?: string[]) => void
}

export function FormInput({
  label, value, onChange, onClick,
  type = 'text', placeholder, disabled = false,
  textarea = false, sx,
  rules, isValid,
  ...props
}: FormInputProps) {
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = e.target.value

    const newErrors: string[] = []
    rules?.forEach((rule) => {
      if (changedValue) {
        const message = !rule.validate(changedValue) ? rule.errorMessage ?? 'Campo invalido' : ''
        if (message) newErrors.push(message)
      }
    })
    onChange?.(changedValue, newErrors.length > 0)
    setErrors(newErrors)
    isValid?.(newErrors.length === 0, newErrors)
  }

  return (
    <Box>
      {label && (
        <FormLabel
          sx={{
            textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em',
            fontWeight: 600, color: (t: Theme) => t.palette.custom.primary[100]
          }}
        >
          {label}
        </FormLabel>
      )}
      <TextField
        type={type}
        value={value}
        onChange={handleChange}
        onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
        placeholder={placeholder}
        fullWidth
        variant="filled"
        disabled={disabled}
        multiline={textarea}
        minRows={3}
        slotProps={{
          htmlInput: { props }
        }}
        sx={sx}
        error={errors.length > 0}
      />

      {errors.length > 0 &&
        <FormHelperText error>
          {errors.map((error, index) => (
            <span key={index}> {error} <br /></span>
          ))}
        </FormHelperText>
      }
    </Box>
  )
}
