import { renderHook } from '@testing-library/react'
import { useUpdateSOSContact } from '../useUpdateSOSContact'
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

const mockContact = {
  id: 'c-1',
  name: 'María',
  last_name: 'García',
  phone_number: '3001234567',
  phone_indicative: '+57',
  location: 'Bogotá',
  relationship: 'Madre',
  user_id: 'user-123',
}

describe('useUpdateSOSContact', () => {
  afterEach(() => vi.clearAllMocks())

  it('updates contact scoped by id and user_id', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: null })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqId })
    vi.mocked(supabase.from).mockReturnValue({ update: mockUpdate } as any)

    const { result } = renderHook(() => useUpdateSOSContact())
    await result.current.updateSOSContact(mockContact)

    expect(mockUpdate).toHaveBeenCalledWith({
      name: 'María',
      last_name: 'García',
      phone_number: '3001234567',
      phone_indicative: '+57',
      location: 'Bogotá',
      relationship: 'Madre',
    })
    expect(mockEqId).toHaveBeenCalledWith('id', 'c-1')
    expect(mockEqUserId).toHaveBeenCalledWith('user_id', 'user-123')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error and throws on Supabase error', async () => {
    const mockEqUserId = vi.fn().mockResolvedValue({ error: new Error('Update failed') })
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUserId })
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: mockEqId }),
    } as any)

    const { result } = renderHook(() => useUpdateSOSContact())
    await expect(result.current.updateSOSContact(mockContact)).rejects.toThrow('Update failed')
    expect(toast.error).toHaveBeenCalled()
  })
})
