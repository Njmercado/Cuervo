import { renderHook } from '@testing-library/react'
import { useCreateSOSContact } from '../useCreateSOSContact'
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

describe('useCreateSOSContact', () => {
  afterEach(() => vi.clearAllMocks())

  it('inserts a contact with the correct fields and user_id', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any)

    const { result } = renderHook(() => useCreateSOSContact())
    await result.current.createSOSContact({
      name: 'María',
      last_name: 'García',
      phone_number: '3001234567',
      phone_indicative: '+57',
      location: 'Bogotá',
      relationship: 'Madre',
    })

    expect(supabase.from).toHaveBeenCalledWith('SOSContact')
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'María',
      last_name: 'García',
      phone_number: '3001234567',
      phone_indicative: '+57',
      location: 'Bogotá',
      relationship: 'Madre',
      user_id: 'user-123',
    })
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error and throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: new Error('Insert failed') }),
    } as any)

    const { result } = renderHook(() => useCreateSOSContact())
    await expect(
      result.current.createSOSContact({
        name: 'X', last_name: 'Y', phone_number: '123', phone_indicative: '', location: '', relationship: '',
      })
    ).rejects.toThrow('Insert failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
