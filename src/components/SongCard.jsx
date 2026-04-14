import React from 'react'

export default function SongCard({ song, index, onClick }) {
  return (
    <div 
      onClick={() => onClick(song)}
      style={{ padding: '1rem', margin: '0.5rem 0', border: '1px solid #ccc',
               borderRadius: 8, cursor: 'pointer' }}>
      <strong>{index + 1}. {song.title}</strong>
      {song.artist && <span> — {song.artist}</span>}
    </div>
  )
}
