import { useState } from 'react'
import { useSetlists } from '../hooks/useSetlists'
import Toast from '../components/Toast'

export default function SetlistsPage() {
  const {
    setlists, songs, loading, setlistSongs, toast,
    fetchSetlistSongs, createSetlist, setActive, deleteSetlist,
    addSong, removeSong, moveSong,
  } = useSetlists()

  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', service_date: '' })
  const [saving, setSaving] = useState(false)

  async function openSetlist(sl) {
    setSelected(sl)
    await fetchSetlistSongs(sl.id)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newForm.name.trim() || !newForm.service_date) return
    setSaving(true)
    const success = await createSetlist(newForm)
    setSaving(false)
    if (success) { setCreating(false); setNewForm({ name: '', service_date: '' }) }
  }

  async function handleSetActive(sl) {
    const success = await setActive(sl)
    if (success && selected?.id === sl.id) setSelected(prev => ({ ...prev, is_active: true }))
  }

  async function handleDeleteSetlist(sl) {
    const success = await deleteSetlist(sl)
    if (success && selected?.id === sl.id) setSelected(null)
  }

  async function handleAddSong(songId) {
    if (setlistSongs.find(s => s.song_id === songId)) return
    await addSong(selected.id, songId, setlistSongs.length)
  }

  async function handleRemoveSong(entry) {
    const remaining = setlistSongs.filter(s => s.id !== entry.id)
    await removeSong(entry, selected.id, remaining)
  }

  async function handleMoveUp(index) {
    if (index === 0) return
    await moveSong(setlistSongs[index], setlistSongs[index - 1], selected.id)
  }

  async function handleMoveDown(index) {
    if (index === setlistSongs.length - 1) return
    await moveSong(setlistSongs[index], setlistSongs[index + 1], selected.id)
  }

  const addableSongs = songs.filter(s => !setlistSongs.find(ss => ss.song_id === s.id))

  // ── Selected setlist view ────────────────────────────────────────────────

  if (selected) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button className="btn-ghost" onClick={() => setSelected(null)}>← Back</button>
          <h2>{selected.name}</h2>
          {!selected.is_active && (
            <button className="btn-activate" onClick={() => handleSetActive(selected)}>Set as live</button>
          )}
          {selected.is_active && <span className="badge-live">Live</span>}
        </div>

        <div className="two-col">
          <div className="panel">
            <h3 className="panel-title">Songs in this setlist</h3>
            {setlistSongs.length === 0 ? (
              <p className="muted">No songs added yet.</p>
            ) : (
              <div className="setlist-songs">
                {setlistSongs.map((entry, i) => (
                  <div key={entry.id} className="setlist-song-row">
                    <span className="pos-num">{i + 1}</span>
                    <div className="setlist-song-info">
                      <span className="song-row-title">{entry.songs.title}</span>
                      {entry.songs.artist && <span className="song-row-artist">{entry.songs.artist}</span>}
                    </div>
                    <div className="song-row-actions">
                      <button className="btn-icon" onClick={() => handleMoveUp(i)} disabled={i === 0} title="Move up">↑</button>
                      <button className="btn-icon" onClick={() => handleMoveDown(i)} disabled={i === setlistSongs.length - 1} title="Move down">↓</button>
                      <button className="btn-danger btn-sm" onClick={() => handleRemoveSong(entry)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h3 className="panel-title">Add songs</h3>
            {addableSongs.length === 0 ? (
              <p className="muted">All songs have been added.</p>
            ) : (
              <div className="add-songs-list">
                {addableSongs.map(song => (
                  <div key={song.id} className="song-row">
                    <div className="song-row-info">
                      <span className="song-row-title">{song.title}</span>
                      {song.artist && <span className="song-row-artist">{song.artist}</span>}
                    </div>
                    <button className="btn-add" onClick={() => handleAddSong(song.id)}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Toast toast={toast} />
      </div>
    )
  }

  // ── Setlist list view ────────────────────────────────────────────────────

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Setlists</h2>
        <button className="btn-primary" onClick={() => setCreating(true)}>+ New setlist</button>
      </div>

      {creating && (
        <form className="admin-form inline-form" onSubmit={handleCreate}>
          <div className="inline-form-fields">
            <input
              type="text"
              placeholder="Setlist name (e.g. Sunday 20 April)"
              value={newForm.name}
              onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <input
              type="date"
              value={newForm.service_date}
              onChange={e => setNewForm(f => ({ ...f, service_date: e.target.value }))}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : setlists.length === 0 ? (
        <div className="empty-state">
          <p>No setlists yet.</p>
        </div>
      ) : (
        <div className="song-list">
          {setlists.map(sl => (
            <div key={sl.id} className={`song-row ${sl.is_active ? 'row-active' : ''}`}>
              <div className="song-row-info">
                <span className="song-row-title">{sl.name}</span>
                <span className="song-row-artist">{new Date(sl.service_date).toDateString()}</span>
              </div>
              <div className="song-row-actions">
                {sl.is_active && <span className="badge-live">Live</span>}
                {!sl.is_active && (
                  <button className="btn-activate btn-sm" onClick={() => handleSetActive(sl)}>Set live</button>
                )}
                <button className="btn-ghost btn-sm" onClick={() => openSetlist(sl)}>Manage songs</button>
                <button className="btn-danger btn-sm" onClick={() => handleDeleteSetlist(sl)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast toast={toast} />
    </div>
  )
}