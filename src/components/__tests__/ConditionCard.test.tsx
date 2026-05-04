import { render, screen, fireEvent } from '@testing-library/react'
import { ConditionCard } from '../molecules/ConditionCard'
import type { Condition } from '../../objects/condition'

vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        custom: {
          primary: { 100: '#006E2A', 10: 'rgba(0,110,42,0.1)' },
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

const mockCondition: Condition = {
  id: 'cond-1',
  title: 'Diabetes',
  medicines: ['Metformina', 'Insulina'],
  created_at: '2024-01-15T00:00:00Z',
  user_id: 'user-123',
}

describe('ConditionCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders title and medicine chips', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Diabetes')).toBeInTheDocument()
    expect(screen.getByText('Metformina')).toBeInTheDocument()
    expect(screen.getByText('Insulina')).toBeInTheDocument()
  })

  it('calls onEdit when "Editar" menu item is clicked', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockCondition)
  })

  it('calls onDelete when "Eliminar" menu item is clicked', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Eliminar'))
    expect(onDelete).toHaveBeenCalledWith('cond-1')
  })
})
