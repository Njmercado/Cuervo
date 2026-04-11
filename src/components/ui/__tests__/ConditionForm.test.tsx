import { render, screen, fireEvent } from '@testing-library/react'
import { ConditionForm } from '../ConditionForm'
import type { Condition } from '../../../objects/condition'

// Stub FormInput
vi.mock('../FormInput', () => ({
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

const mockCondition: Condition = {
  id: 'cond-1',
  title: 'Asma',
  medicine: ['Salbutamol'],
  user_id: 'user-123',
}

describe('ConditionForm', () => {
  const onSave = vi.fn()
  const onCancel = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders an empty form in create mode', () => {
    render(<ConditionForm onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Título')).toHaveValue('')
    expect(screen.getByText('Guardar')).toBeInTheDocument()
  })

  it('pre-fills title in edit mode and shows existing medicines', () => {
    render(<ConditionForm condition={mockCondition} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByTestId('input-Título')).toHaveValue('Asma')
    expect(screen.getByText('Salbutamol')).toBeInTheDocument()
    expect(screen.getByText('Actualizar')).toBeInTheDocument()
  })

  it('calls onSave with full Condition when editing', () => {
    render(<ConditionForm condition={mockCondition} onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Título'), { target: { value: 'Asma moderada' } })
    fireEvent.submit(screen.getByTestId('input-Título').closest('form')!)
    expect(onSave).toHaveBeenCalledWith({ ...mockCondition, title: 'Asma moderada' })
  })

  it('calls onSave with ConditionData (no id) in create mode', () => {
    render(<ConditionForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByTestId('input-Título'), { target: { value: 'Hipertensión' } })
    fireEvent.submit(screen.getByTestId('input-Título').closest('form')!)
    expect(onSave).toHaveBeenCalledWith({ title: 'Hipertensión', medicine: [] })
    expect(onSave).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.anything() }))
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<ConditionForm onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })
})
