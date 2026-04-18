import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SongCard from '../../user/components/SongCard'

const mockSong = { id: '1', title: 'Amazing Grace', artist: 'John Newton' }

describe('SongCard', () => {
  it('renders the song title', () => {
    render(<SongCard song={mockSong} index={0} onClick={() => {}} />)
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
  })

  it('renders the artist name', () => {
    render(<SongCard song={mockSong} index={0} onClick={() => {}} />)
    expect(screen.getByText('John Newton')).toBeInTheDocument()
  })

  it('calls onClick with the song when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<SongCard song={mockSong} index={0} onClick={handleClick} />)
    await user.click(screen.getByText('Amazing Grace'))

    expect(handleClick).toHaveBeenCalledWith(mockSong)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders without an artist gracefully', () => {
    const songNoArtist = { id: '2', title: 'How Great Thou Art' }
    render(<SongCard song={songNoArtist} index={0} onClick={() => {}} />)
    expect(screen.getByText('How Great Thou Art')).toBeInTheDocument()
  })
})