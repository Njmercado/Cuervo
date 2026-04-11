import { renderHook } from '@testing-library/react'
import { useDeleteMedicalCondition } from '../useDeleteMedicalCondition'
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

describe('useDeleteCondition', () => {
  afterEach(() => vi.clearAllMocks())

  it('deletes condition scoped by id and user_id', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: null })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({ eq: mockEqId }),
    } as any)

    const { result } = renderHook(() => useDeleteMedicalCondition())
    await result.current.deleteCondition('cond-1')

    expect(mockEqId).toHaveBeenCalledWith('id', 'cond-1')
    expect(mockEqUserId).toHaveBeenCalledWith('user_id', 'user-123')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error and throws on Supabase error', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: new Error('Delete failed') })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({ eq: mockEqId }),
    } as any)

    const { result } = renderHook(() => useDeleteMedicalCondition())
    await expect(result.current.deleteCondition('cond-1')).rejects.toThrow('Delete failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
