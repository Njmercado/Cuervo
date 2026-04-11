import { renderHook } from '@testing-library/react'
import { useUpdateMedicalCondition } from '../useUpdateMedicalCondition'
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
import type { Condition } from '../../objects/condition'

const mockCondition: Condition = { id: 'cond-1', title: 'Asma', medicines: ['Salbutamol'], user_id: 'user-123' }

describe('useUpdateCondition', () => {
  afterEach(() => vi.clearAllMocks())

  it('updates title and medicine scoped by id and user_id', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: null })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqId })
    vi.mocked(supabase.from).mockReturnValue({ update: mockUpdate } as any)

    const { result } = renderHook(() => useUpdateMedicalCondition())
    await result.current.updateCondition(mockCondition)

    expect(mockUpdate).toHaveBeenCalledWith({ title: 'Asma', medicines: ['Salbutamol'] })
    expect(mockEqId).toHaveBeenCalledWith('id', 'cond-1')
    expect(mockEqUserId).toHaveBeenCalledWith('user_id', 'user-123')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error and throws on Supabase error', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: new Error('Update failed') })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: mockEqId }),
    } as any)

    const { result } = renderHook(() => useUpdateMedicalCondition())
    await expect(result.current.updateCondition(mockCondition)).rejects.toThrow('Update failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
