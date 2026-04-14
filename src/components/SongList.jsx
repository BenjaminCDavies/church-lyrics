import React from 'react'
import SongCard from './SongCard'

export default function SongList({ setlist, songs, onSelectSong }) {
  if (!setlist) return <p>No setlist for this week yet.</p>

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>{setlist.name}</h1>
      <p>{new Date(setlist.service_date).toDateString()}</p>
      {songs.map((song, i) => (
        <SongCard 
          key={song.id} 
          song={song} 
          index={i} 
          onClick={onSelectSong} 
        />
      ))}
    </div>
  )
}
