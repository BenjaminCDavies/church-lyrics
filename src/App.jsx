import { useState } from 'react'
import { useSetlist } from './hooks/useSetlist'
import SongList from './components/SongList'
import SongDetails from './components/SongDetails'

export default function App() {
  const { setlist, songs, loading, error } = useSetlist()
  const [selectedSong, setSelectedSong] = useState(null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Something went wrong: {error.message}</p>

  if (selectedSong) {
    return (
      <SongDetails
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
      />
    )
  }

  return (
    <SongList
      setlist={setlist}
      songs={songs}
      onSelectSong={setSelectedSong}
    />
  )
}