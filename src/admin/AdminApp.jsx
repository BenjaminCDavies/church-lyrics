import { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import './admin.css'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setError(true)
      setPw('')
    }
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-logo">
            <span className="admin-logo-icon">♪</span>
          </div>
          <h1>Admin</h1>
          <p className="admin-login-sub">Church lyrics manager</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              autoFocus
              className={error ? 'input-error' : ''}
            />
            {error && <p className="error-msg">Incorrect password</p>}
            <button type="submit" className="btn-primary">Sign in</button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />
}