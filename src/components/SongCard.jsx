import React from 'react';

export default function SongCard({ song, index, onClick, isDarkMode = true }) {
  // Matching the theme colors from your SongDetails
  const theme = {
    cardBg: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    artist: isDarkMode ? '#b0b0b0' : '#636e72',
    accent: '#3498db',
    border: isDarkMode ? '#3d3d3d' : '#e0e0e0'
  };

  return (
    <div
      className="song-card"
      onClick={() => onClick(song)}
      style={{ 
        ...styles.card, 
        backgroundColor: theme.cardBg,
        borderColor: theme.border
      }}
    >
      <div style={styles.info}>
        <strong style={{ ...styles.title, color: theme.text }}>{song.title}</strong>
        {song.artist && (
          <span style={{ ...styles.artist, color: theme.artist }}>
            {song.artist}
          </span>
        )}
      </div>
      <div style={{ color: theme.artist, fontSize: '1.2rem' }}>›</div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.2rem',
    margin: '0.75rem 0',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid',
    transition: 'transform 0.1s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  number: {
    fontSize: '1.1rem',
    fontWeight: '800',
    marginRight: '1rem',
    minWidth: '24px',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  artist: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  }
};
