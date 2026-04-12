import { renderHook } from '@testing-library/react'
import { useGetSOSContacts } from '../useGetSOSContacts'
import { supabase } from '../../lib/supabase'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-123' } }),
}))

describe('useGetSOSContacts', () => {
  afterEach(() => vi.clearAllMocks())

  it('returns contacts for the logged-in user with no filters', async () => {
    const mockContacts = [
      { id: '1', name: 'María', last_name: 'García', phone_number: '3001234567', phone_indicative: '+57', location: 'Bogotá', relationship: 'Madre', user_id: 'user-123' },
    ]

    const mockQuery: any = {}
    mockQuery.then = vi.fn().mockImplementation((res) => res({ data: mockContacts, error: null }))
    mockQuery.eq = vi.fn().mockReturnValue(mockQuery)
    const mockSelect = vi.fn().mockReturnValue(mockQuery)

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as any)

    const { result } = renderHook(() => useGetSOSContacts())
    const data = await result.current.getSOSContacts()

    expect(supabase.from).toHaveBeenCalledWith('SOSContact')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123')
    expect(data).toEqual(mockContacts)
  })

  it('applies search and relationship filters', async () => {
    const mockContacts: any[] = []

    const mockQuery: any = {}
    mockQuery.eq = vi.fn().mockImplementation((key) => {
      if (key === 'user_id') return mockQuery
      if (key === 'relationship') return Promise.resolve({ data: mockContacts, error: null })
      return mockQuery
    })
    mockQuery.or = vi.fn().mockReturnValue(mockQuery)
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(mockQuery),
    } as any)

    const { result } = renderHook(() => useGetSOSContacts())
    await result.current.getSOSContacts({ search: 'Mar', relationship: 'Madre' })

    expect(mockQuery.or).toHaveBeenCalledWith('name.ilike.%Mar%,last_name.ilike.%Mar%,phone_number.ilike.%Mar%')
    expect(mockQuery.eq).toHaveBeenCalledWith('relationship', 'Madre')
  })

  it('throws when Supabase returns an error', async () => {
    const mockQuery: any = {}
    mockQuery.then = vi.fn().mockImplementation((res) => res({ data: null, error: new Error('DB error') }))
    mockQuery.eq = vi.fn().mockReturnValue(mockQuery)
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(mockQuery),
    } as any)

    const { result } = renderHook(() => useGetSOSContacts())
    await expect(result.current.getSOSContacts()).rejects.toThrow('DB error')
  })
})
