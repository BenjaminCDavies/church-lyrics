import { useState } from 'react'
import { useSetlist } from './user/hooks/useSetlist'
import SongList from './user/components/SongList'
import SongDetails from './user/components/SongDetails'

export default function App() {
  const { setlist, songs, loading, error } = useSetlist()
  const [selectedSong, setSelectedSong] = useState(null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>No setlists have been set</p>

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