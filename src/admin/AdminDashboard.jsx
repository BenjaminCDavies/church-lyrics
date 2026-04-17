import { useState } from 'react'
import SongsPage from './pages/SongsPage'
import SetlistsPage from './pages/SetlistsPage'

const NAV = [
  { id: 'songs', label: 'Songs' },
  { id: 'setlists', label: 'Setlists' },
]

export default function AdminDashboard({ onLogout }) {
  const [page, setPage] = useState('songs')

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo-icon">♪</span>
          <span className="admin-sidebar-title">Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`admin-nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={onLogout}>Sign out</button>
      </aside>

      <main className="admin-main">
        {page === 'songs' && <SongsPage />}
        {page === 'setlists' && <SetlistsPage />}
      </main>
    </div>
  )
}