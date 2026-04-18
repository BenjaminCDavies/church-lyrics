import { render, screen, fireEvent } from '@testing-library/react'
import SongDetails from '../../user/components/SongDetails'

const mockSongWithLyrics = {
  title: 'In Christ Alone',
  artist: 'Getty',
  sections: [
    { id: 's1', label: 'Verse 1', content: 'In Christ alone my hope is found' },
    { id: 's2', label: 'Chorus', content: 'No guilt in life, no fear in death' }
  ]
}

describe('SongDetails Component', () => {
  it('returns null if no song is provided', () => {
    const { container } = render(<SongDetails song={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all lyric sections', () => {
    render(<SongDetails song={mockSongWithLyrics} />)
    expect(screen.getByText('Verse 1')).toBeInTheDocument()
    expect(screen.getByText('Chorus')).toBeInTheDocument()
  })

  it('toggles light/dark mode on button click', () => {
    render(<SongDetails song={mockSongWithLyrics} />)
    const toggleBtn = screen.getByRole('button', { name: /Light|Dark/i })
    
    // Initial state (Dark)
    expect(toggleBtn).toHaveTextContent('Light')
    
    // Click to switch to Light mode
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveTextContent('Dark')
  })

  it('calls onBack when the back button is clicked', () => {
    const backFn = vi.fn()
    render(<SongDetails song={mockSongWithLyrics} onBack={backFn} />)
    const backBtn = screen.getByText(/Back/i)
    
    fireEvent.click(backBtn)
    expect(backFn).toHaveBeenCalledTimes(1)
  })
})