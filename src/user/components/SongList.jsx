import React from 'react';
import SongCard from './SongCard';

export default function SongList({ setlist, songs, onSelectSong, isDarkMode = true }) {
  if (!setlist) return <p style={styles.empty}>No setlist for this week yet.</p>;

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#1a1a1a',
    title: isDarkMode ? '#ffffff' : '#2d3436',
    secondary: isDarkMode ? '#b0b0b0' : '#636e72',
    accent: '#3498db'
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.bg, color: theme.text }}>
      <header style={styles.header}>
        <h1 style={{ ...styles.title, color: theme.title }}>{setlist.name}</h1>
        <p style={{ ...styles.date, color: theme.secondary }}>
          {new Date(setlist.service_date).toLocaleDateString(undefined, { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <div style={{ ...styles.divider, backgroundColor: theme.accent }}></div>
      </header>

      <div style={styles.list}>
        {songs.map((song, i) => (
          <SongCard 
            key={song.id} 
            song={song} 
            index={i} 
            onClick={onSelectSong}
            isDarkMode={isDarkMode} 
          />
        ))}
      </div>
      
      <style>{`
        @media (max-width: 480px) {
          h1 { font-size: 1.8rem !important; }
        }
        @media (hover: hover) {
          .song-card:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
          }
        }
        `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, system-ui, sans-serif',
  },
  header: {
    maxWidth: '600px',
    margin: '0 auto 2.5rem auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
  },
  date: {
    fontSize: '1.1rem',
    margin: 0,
    fontWeight: '500',
  },
  divider: {
    width: '40px',
    height: '4px',
    margin: '1.5rem auto',
    borderRadius: '2px',
  },
  list: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  }
};
