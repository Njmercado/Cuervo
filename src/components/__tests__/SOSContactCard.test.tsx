import { render, screen, fireEvent } from '@testing-library/react'
import { SOSContactCard } from '../molecules/SOSContactCard'
import type { SOSContact } from '../../objects/sosContact'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        custom: {
          tertiary: { 100: '#C62828', 20: 'rgba(198,40,40,0.2)', 5: 'rgba(198,40,40,0.05)' },
          neutral: { 100: '#EEEEF0' },
        },
      },
      customSizes: {
        font: { tiny: '0.625rem', xl: '1.5rem', small: '0.75rem' },
        radius: { md: '8px' },
      },
    }),
  }
})

const mockContact: SOSContact = {
  id: 'c-1',
  name: 'María',
  last_name: 'García',
  phone_number: '3001234567',
  phone_indicative: '+57',
  location: 'Bogotá',
  relationship: 'Madre',
  created_at: '2024-01-15T00:00:00Z',
  user_id: 'user-123',
}

describe('SOSContactCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders name, phone, location and relationship', () => {
    render(<SOSContactCard contact={mockContact} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('+57 3001234567')).toBeInTheDocument()
    expect(screen.getByText('Bogotá')).toBeInTheDocument()
    expect(screen.getByText('Madre')).toBeInTheDocument()
  })

  it('calls onEdit when "Editar" menu item is clicked', () => {
    render(<SOSContactCard contact={mockContact} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockContact)
  })

  it('calls onDelete when "Eliminar" menu item is clicked', () => {
    render(<SOSContactCard contact={mockContact} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith('c-1')
  })
})
