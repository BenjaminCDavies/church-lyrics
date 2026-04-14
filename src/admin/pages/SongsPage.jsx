import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

const EMPTY = { title: '', artist: '', lyrics: '' }

export default function SongsPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null = list view, 'new' or song object = form
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchSongs() }, [])

  async function fetchSongs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('title')
    if (!error) setSongs(data)
    setLoading(false)
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openNew() {
    setForm(EMPTY)
    setEditing('new')
  }

  function openEdit(song) {
    setForm({ title: song.title, artist: song.artist || '', lyrics: song.lyrics })
    setEditing(song)
  }

  function cancelEdit() {
    setEditing(null)
    setForm(EMPTY)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.lyrics.trim()) return
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      artist: form.artist.trim() || null,
      lyrics: form.lyrics.trim(),
    }
    let error
    if (editing === 'new') {
      ;({ error } = await supabase.from('songs').insert(payload))
    } else {
      ;({ error } = await supabase.from('songs').update(payload).eq('id', editing.id))
    }
    setSaving(false)
    if (error) { showToast('Error saving song', 'error'); return }
    showToast(editing === 'new' ? 'Song added' : 'Song updated')
    cancelEdit()
    fetchSongs()
  }

  async function handleDelete(song) {
    const { error } = await supabase.from('songs').delete().eq('id', song.id)
    if (error) { showToast('Error deleting song', 'error'); return }
    showToast('Song deleted')
    setConfirmDelete(null)
    fetchSongs()
  }

  if (editing) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button className="btn-ghost" onClick={cancelEdit}>← Back</button>
          <h2>{editing === 'new' ? 'Add song' : 'Edit song'}</h2>
        </div>

        <div className="admin-form">
          <div className="form-row">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Song title"
              autoFocus
            />
          </div>
          <div className="form-row">
            <label>Artist</label>
            <input
              type="text"
              value={form.artist}
              onChange={e => setForm(f => ({ ...f, artist: e.target.value }))}
              placeholder="Artist or band (optional)"
            />
          </div>
          <div className="form-row">
            <label>Lyrics <span className="required">*</span></label>
            <textarea
              value={form.lyrics}
              onChange={e => setForm(f => ({ ...f, lyrics: e.target.value }))}
              placeholder="Paste full lyrics here..."
              rows={20}
            />
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.lyrics.trim()}
            >
              {saving ? 'Saving…' : 'Save song'}
            </button>
          </div>
        </div>

        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Songs</h2>
        <button className="btn-primary" onClick={openNew}>+ Add song</button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <p>No songs yet.</p>
          <button className="btn-primary" onClick={openNew}>Add your first song</button>
        </div>
      ) : (
        <div className="song-list">
          {songs.map(song => (
            <div key={song.id} className="song-row">
              <div className="song-row-info">
                <span className="song-row-title">{song.title}</span>
                {song.artist && <span className="song-row-artist">{song.artist}</span>}
              </div>
              <div className="song-row-actions">
                <button className="btn-ghost btn-sm" onClick={() => openEdit(song)}>Edit</button>
                <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(song)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete "{confirmDelete.title}"?</h3>
            <p className="muted">This will also remove it from any setlists.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}