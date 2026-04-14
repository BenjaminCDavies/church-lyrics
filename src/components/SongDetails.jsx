import React from 'react'

export default function SongDetails({ song, onBack }) {
  if (!song) return null

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <button onClick={onBack}>← Back</button>
      <h1>{song.title}</h1>
      {song.artist && <p>{song.artist}</p>}
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.8 }}>
        {song.lyrics}
      </pre>
    </div>
  )
}
