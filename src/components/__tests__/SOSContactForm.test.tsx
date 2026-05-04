import { render, screen, fireEvent } from '@testing-library/react'
import { SOSContactForm } from '../molecules/SOSContactForm'
import type { SOSContact } from '../../objects/sosContact'

// Stub FormInput
vi.mock('../atoms/FormInput', () => ({
  FormInput: ({ label, value, onChange, placeholder }: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <input id={label} value={value} onChange={onChange} placeholder={placeholder} data-testid={`input-${label}`} />
    </div>
  ),
}))

// Stub FormSelect
vi.mock('../atoms/FormSelect', () => ({
  FormSelect: ({ label, value, onChange, options }: {
    label: string
    value: string
    onChange: (e: { target: { value: string } }) => void
    options: string[]
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <select id={label} value={value} onChange={(e) => onChange(e)} data-testid={`select-${label}`}>
        <option value="">Seleccione</option>
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  ),
}))

const mockContact: SOSContact = {
  id: 'c-1',
  name: 'María',
  last_name: 'García',
  phone_number: '3001234567',
  phone_indicative: '+57',
  location: 'Bogotá',
  relationship: 'Madre',
  user_id: 'user-123',
}

describe('SOSContactForm', () => {
  const onSave = vi.fn()
  const onCancel = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders empty fields in create mode', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Nombre')).toHaveValue('')
    expect(screen.getByTestId('input-Apellido')).toHaveValue('')
    expect(screen.getByTestId('input-Teléfono')).toHaveValue('')
    expect(screen.getByText('Guardar')).toBeInTheDocument()
  })

  it('pre-fills fields in edit mode', () => {
    render(<SOSContactForm contact={mockContact} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Nombre')).toHaveValue('María')
    expect(screen.getByTestId('input-Apellido')).toHaveValue('García')
    expect(screen.getByTestId('input-Teléfono')).toHaveValue('3001234567')
    expect(screen.getByTestId('input-Indicativo')).toHaveValue('+57')
    expect(screen.getByText('Actualizar')).toBeInTheDocument()
  })

  it('calls onSave with full SOSContact when editing', () => {
    render(<SOSContactForm contact={mockContact} onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Nombre'), { target: { value: 'Ana' } })
    fireEvent.submit(screen.getByTestId('input-Nombre').closest('form')!)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ id: 'c-1', name: 'Ana' }))
  })

  it('calls onSave with SOSContactData (no id) in create mode', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Nombre'), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByTestId('input-Apellido'), { target: { value: 'López' } })
    fireEvent.change(screen.getByTestId('input-Teléfono'), { target: { value: '3109876543' } })
    fireEvent.submit(screen.getByTestId('input-Nombre').closest('form')!)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Carlos', last_name: 'López' }))
    expect(onSave).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.anything() }))
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<SOSContactForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })
})
