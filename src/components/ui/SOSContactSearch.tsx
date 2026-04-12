import { useState } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { RELATIONSHIP_OPTIONS } from '../../constants'

export interface SOSContactSearchProps {
  onSearch: (query: string, relationship: string) => void
}

export function SOSContactSearch({ onSearch }: SOSContactSearchProps) {
  const [query, setQuery] = useState('')
  const [relationship, setRelationship] = useState('Todos')

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearch(value, relationship === 'Todos' ? '' : relationship)
  }

  const handleRelationshipChange = (e: SelectChangeEvent) => {
    const value = e.target.value
    setRelationship(value)
    onSearch(query, value === 'Todos' ? '' : value)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        variant="filled"
        size="small"
        sx={{ flexGrow: 1, minWidth: 200 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <FormControl variant="filled" size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }}>
          Relación
        </InputLabel>
        <Select
          value={relationship}
          onChange={handleRelationshipChange}
          label="Relación"
        >
          <MenuItem value="Todos">Todos</MenuItem>
          {RELATIONSHIP_OPTIONS.map((rel) => (
            <MenuItem key={rel} value={rel}>
              {rel}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
