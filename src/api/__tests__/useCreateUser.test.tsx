import { renderHook } from '@testing-library/react'
import { useCreateUser } from '../useCreateUser'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

describe('useCreateUser', () => {
  afterEach(() => vi.clearAllMocks())

  it('inserts a user with the correct fields', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any)

    const { result } = renderHook(() => useCreateUser())
    await result.current.createUser({
      user_id: 'user-456',
      name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
    })

    expect(supabase.from).toHaveBeenCalledWith('User')
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-456',
      name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
    })
  })

  it('shows toast.error and throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: new Error('Insert failed') }),
    } as any)

    const { result } = renderHook(() => useCreateUser())
    await expect(
      result.current.createUser({
        user_id: 'user-456',
        name: 'John',
        full_name: 'John',
      })
    ).rejects.toThrow('Insert failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
