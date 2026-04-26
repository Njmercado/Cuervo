import { type ComponentProps, memo, useState } from 'react'
import { TextField, FormHelperText } from '@mui/material'
import { type SxProps, type Theme } from '@mui/material'

export interface Rule {
  validate: (value: any) => boolean
  errorMessage?: string
}

interface FormInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  label: string
  onChange?: (value: string) => void
  disabled?: boolean
  textarea?: boolean
  sx?: SxProps<Theme>
  rules?: Rule[]
  isValid?: (valid: boolean, messages?: string[]) => void
}

export function Input({
  label, value, onChange, onClick,
  type = 'text', placeholder, disabled = false,
  textarea = false, sx,
  rules, isValid,
  ...props
}: FormInputProps) {
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = e.target.value.toUpperCase()
    onChange?.(changedValue)

    const newErrors: string[] = []
    rules?.forEach((rule) => {
      if (changedValue) {
        const message = !rule.validate(changedValue) ? rule.errorMessage ?? 'Campo invalido' : ''
        if (message) newErrors.push(message)
      }
    })
    setErrors(newErrors)
    isValid?.(newErrors.length === 0, newErrors)
  }

  return (
    <>
      <TextField
        label={label}
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
          inputLabel: {
            sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' },
          },
          htmlInput: { props }
        }}
        sx={sx}
        error={errors.length > 0}
      />

      <FormHelperText error={errors.length > 0}>
        {
          errors && errors.map((error, index) => (
            <span key={index}> {error} <br /></span>
          ))
        }
      </FormHelperText>
    </>
  )
}

export const FormInput = memo(Input, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value
})