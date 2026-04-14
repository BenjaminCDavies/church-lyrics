import React, { useState, useEffect } from 'react';

export default function SongDetails({ song, onBack }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for church settings

  if (!song) return null;

  // Theme Colors
  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#1a1a1a',
    title: isDarkMode ? '#ffffff' : '#2d3436',
    secondary: isDarkMode ? '#b0b0b0' : '#636e72',
    buttonBg: isDarkMode ? '#2d2d2d' : '#f0f0f0',
    accent: '#3498db' // Calming blue accent
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.bg, color: theme.text }}>
      {/* Header with Navigation and Toggle */}
      <header style={styles.header}>
        <button onClick={onBack} style={{ ...styles.navButton, backgroundColor: theme.buttonBg, color: theme.text }}>
          ← <span className="hide-mobile">Back</span>
        </button>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ ...styles.navButton, backgroundColor: theme.buttonBg, color: theme.text }}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main style={styles.content}>
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={{ ...styles.title, color: theme.title }}>{song.title}</h1>
          {song.artist && <p style={{ ...styles.artist, color: theme.secondary }}>{song.artist}</p>}
          <div style={{ ...styles.divider, backgroundColor: theme.accent }}></div>
        </div>

        {/* Lyrics Section */}
        <div style={styles.lyricsWrapper}>
          <pre style={{ ...styles.lyrics, color: theme.text }}>
            {song.lyrics}
          </pre>
        </div>
      </main>

      {/* Embedded CSS for Media Queries */}
      <style>{`
        @media (max-width: 480px) {
          .hide-mobile { display: none; }
          h1 { font-size: 1.8rem !important; }
          pre { font-size: 1.1rem !important; line-height: 1.6 !important; }
        }
        @media (min-width: 1024px) {
          pre { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    padding: '0 1rem',
    fontFamily: '-apple-system, system-ui, sans-serif',
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
  },
  navButton: {
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    paddingBottom: '4rem',
  },
  titleSection: {
    textAlign: 'center',
    margin: '2rem 0',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.2',
  },
  artist: {
    fontSize: '1.2rem',
    margin: 0,
    opacity: 0.8,
  },
  divider: {
    width: '50px',
    height: '3px',
    margin: '1.5rem auto',
    borderRadius: '2px',
  },
  lyricsWrapper: {
    width: '100%',
  },
  lyrics: {
    whiteSpace: 'pre-wrap',
    fontSize: '1.3rem',
    lineHeight: '1.9',
    fontFamily: 'inherit',
    textAlign: 'center',
    margin: 0,
    padding: '0 0.5rem',
  }
};