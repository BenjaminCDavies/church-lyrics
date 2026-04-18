import { renderHook, waitFor } from '@testing-library/react'
import { useSetlist } from '../../user/hooks/useSetlist'

vi.mock('../../shared/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'sl-1', name: 'Sunday Service', service_date: '2024-01-14', is_active: true },
            error: null
          })),
          order: vi.fn(() => Promise.resolve({
            data: [
              {
                position: 1,
                songs: {
                  id: 's-1', title: 'Amazing Grace', artist: 'John Newton',
                  song_sections: [{ id: 'sec-1', label: 'Verse 1', content: 'Amazing grace', position: 1 }]
                }
              }
            ],
            error: null
          }))
        }))
      }))
    }))
  }
}))

describe('useSetlist', () => {
  it('loads the active setlist and its songs', async () => {
    const { result } = renderHook(() => useSetlist())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.setlist.name).toBe('Sunday Service')
    expect(result.current.songs).toHaveLength(1)
    expect(result.current.songs[0].title).toBe('Amazing Grace')
  })
})