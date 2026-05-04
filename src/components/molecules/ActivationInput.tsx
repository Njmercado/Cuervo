import { useState } from 'react'
import {
  Box,
  TextField,
  InputLabel,
  Button,
  InputAdornment,
} from '@mui/material'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface ActivationInputProps {
  initialCode?: string
  loading?: boolean
  onVerify: (code: string) => void
}

export function ActivationInput({ initialCode, loading, onVerify }: ActivationInputProps) {
  const [code, setCode] = useState(initialCode ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed) {
      onVerify(trimmed)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <InputLabel shrink htmlFor="activation-code-input">CÓDIGO DE ACTIVACIÓN *</InputLabel>
        <TextField
          id="activation-code-input"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej: QE-XXXX-XXXX"
          required
          autoFocus
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ConfirmationNumberOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !code.trim()}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
        sx={{ mt: 1 }}
      >
        VERIFICAR CÓDIGO
      </Button>
    </Box>
  )
}
