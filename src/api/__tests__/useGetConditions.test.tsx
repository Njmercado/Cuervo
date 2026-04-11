import { renderHook } from '@testing-library/react'
import { useGetMedicalConditions } from '../useGetMedicalConditions'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-123' } }),
}))

import { supabase } from '../../lib/supabase'

describe('useGetConditions', () => {
  afterEach(() => vi.clearAllMocks())

  it('returns conditions for the logged-in user', async () => {
    const mockConditions = [
      { id: '1', title: 'Diabetes', description: 'Tipo 2', user_id: 'user-123' },
    ]

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockConditions, error: null }),
      }),
    } as any)

    const { result } = renderHook(() => useGetMedicalConditions())
    const data = await result.current.getConditions()

    expect(supabase.from).toHaveBeenCalledWith('MedicalCondition')
    expect(data).toEqual(mockConditions)
  })

  it('throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
      }),
    } as any)

    const { result } = renderHook(() => useGetMedicalConditions())
    await expect(result.current.getConditions()).rejects.toThrow('DB error')
  })
})
