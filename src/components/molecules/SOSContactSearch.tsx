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
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr', md: '1fr 5fr' }, gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <FormControl variant="filled" size="small">
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
      <TextField
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        label="BUSCAR"
        variant="filled"
        size="small"
        sx={{ flexGrow: 1, minWidth: 200 }}
        slotProps={{
          inputLabel: {
            sx: { textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
