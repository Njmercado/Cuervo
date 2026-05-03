import { Box } from '@mui/material'
import type { EngravingData } from '../../objects/engraving'
import { RH } from '../../objects/user'
import { RELATIONSHIP_OPTIONS } from '../../constants'
import { FormInput, FormSelect } from './'

interface EngravingFormProps {
  data: EngravingData
  onChange: (field: keyof EngravingData, value: string, error?: boolean) => void
}

export function EngravingForm({ data, onChange }: EngravingFormProps) {
  const handle = (field: keyof EngravingData) => (value: string, error?: boolean) => {
    onChange(field, value, error)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormSelect
        placeholder="Tipo de sangre"
        value={data.rh}
        onChange={(e) => handle('rh')(e.target.value)}
        options={Object.keys(RH).map((key) => ({ value: key, label: key }))}
      />
      <FormInput
        placeholder="Número de identificación"
        id="eng-id"
        value={data.idNumber}
        onChange={handle('idNumber')}
        rules={[
          {
            validate: (value) => /^\d+$/.test(value),
            errorMessage: 'Por favor ingrese un número de teléfono válido',
          },
        ]}
      />
      <FormInput
        placeholder="Condición médica"
        id="eng-condition"
        value={data.condition}
        onChange={handle('condition')}
        rules={[
          {
            validate: (value) => value.length <= 20,
            errorMessage: 'La condición médica no debe exceder los 20 caracteres',
          },
        ]}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
        <FormSelect
          placeholder="Parentesco"
          value={data.sosRelationship}
          onChange={(e) => handle('sosRelationship')(e.target.value)}
          options={RELATIONSHIP_OPTIONS}
        />
        <FormInput
          id="eng-sos-phone"
          value={data.sosPhone}
          onChange={handle('sosPhone')}
          placeholder="Número de teléfono"
          rules={[
            {
              validate: (value) => /^[0-9]+$/.test(value),
              errorMessage: 'Por favor ingrese un número de teléfono válido',
            },
            {
              validate: (value) => value.length >= 7 && value.length <= 10,
              errorMessage: 'El número de teléfono debe tener entre 7 y 10 dígitos',
            }
          ]}
        />
      </Box>
    </Box>
  )
}
