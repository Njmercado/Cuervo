import { renderHook } from '@testing-library/react'
import { useCreateMedicalCondition } from '../useCreateMedicalCondition'
import toast from 'react-hot-toast'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-123' } }),
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

import { supabase } from '../../lib/supabase'

describe('useCreateCondition', () => {
  afterEach(() => vi.clearAllMocks())

  it('inserts a condition with the correct fields and user_id', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any)

    const { result } = renderHook(() => useCreateMedicalCondition())
    await result.current.createCondition({ title: 'Diabetes', medicines: ['Metformina', 'Insulina'] })

    expect(supabase.from).toHaveBeenCalledWith('MedicalCondition')
    expect(mockInsert).toHaveBeenCalledWith({
      title: 'Diabetes',
      medicines: ['Metformina', 'Insulina'],
      user_id: 'user-123',
    })
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error and throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: new Error('Insert failed') }),
    } as any)

    const { result } = renderHook(() => useCreateMedicalCondition())
    await expect(
      result.current.createCondition({ title: 'X', medicines: [] })
    ).rejects.toThrow('Insert failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
