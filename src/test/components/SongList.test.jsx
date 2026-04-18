import { render, screen } from '@testing-library/react'
import SongList from '../../user/components/SongList'

const mockSetlist = { name: 'Sunday Service', service_date: '2024-05-20' }
const mockSongs = [
  { id: '1', title: 'Song One', artist: 'Artist A' },
  { id: '2', title: 'Song Two', artist: 'Artist B' }
]

describe('SongList Component', () => {
  it('renders "no setlist" message when setlist is null', () => {
    render(<SongList setlist={null} songs={[]} />)
    expect(screen.getByText(/No setlist for this week yet/i)).toBeInTheDocument()
  })

  it('renders the setlist name and formatted date', () => {
    render(<SongList setlist={mockSetlist} songs={mockSongs} />)
    expect(screen.getByText('Sunday Service')).toBeInTheDocument()
    // The date formatter will turn '2024-05-20' into a string containing 'Monday'
    expect(screen.getByText(/Monday/i)).toBeInTheDocument()
  })

  it('renders the correct number of SongCard components', () => {
    render(<SongList setlist={mockSetlist} songs={mockSongs} onSelectSong={vi.fn()} />)
    const titles = screen.getAllByText(/Song/i)
    expect(titles).toHaveLength(2)
  })
})