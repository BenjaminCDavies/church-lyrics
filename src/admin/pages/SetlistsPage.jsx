import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export default function SetlistsPage() {
  const [setlists, setSetlists] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)     // setlist being managed
  const [setlistSongs, setSetlistSongs] = useState([]) // songs in selected setlist
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', service_date: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: sl }, { data: sg }] = await Promise.all([
      supabase.from('weekly_setlists').select('*').order('service_date', { ascending: false }),
      supabase.from('songs').select('id, title, artist').order('title'),
    ])
    setSetlists(sl || [])
    setSongs(sg || [])
    setLoading(false)
  }

  async function fetchSetlistSongs(setlistId) {
    const { data } = await supabase
      .from('setlist_songs')
      .select('id, position, song_id, songs(id, title, artist)')
      .eq('setlist_id', setlistId)
      .order('position')
    setSetlistSongs(data || [])
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function openSetlist(sl) {
    setSelected(sl)
    await fetchSetlistSongs(sl.id)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newForm.name.trim() || !newForm.service_date) return
    setSaving(true)
    const { error } = await supabase.from('weekly_setlists').insert({
      name: newForm.name.trim(),
      service_date: newForm.service_date,
      is_active: false,
    })
    setSaving(false)
    if (error) { showToast('Error creating setlist', 'error'); return }
    showToast('Setlist created')
    setCreating(false)
    setNewForm({ name: '', service_date: '' })
    fetchAll()
  }

  async function handleSetActive(sl) {
    // Deactivate all, then activate the chosen one
    await supabase.from('weekly_setlists').update({ is_active: false }).neq('id', sl.id)
    const { error } = await supabase.from('weekly_setlists').update({ is_active: true }).eq('id', sl.id)
    if (error) { showToast('Error setting active', 'error'); return }
    showToast(`"${sl.name}" is now live`)
    fetchAll()
    if (selected?.id === sl.id) setSelected({ ...sl, is_active: true })
  }

  async function handleDeleteSetlist(sl) {
    const { error } = await supabase.from('weekly_setlists').delete().eq('id', sl.id)
    if (error) { showToast('Error deleting setlist', 'error'); return }
    showToast('Setlist deleted')
    if (selected?.id === sl.id) setSelected(null)
    fetchAll()
  }

  async function addSongToSetlist(songId) {
    if (setlistSongs.find(s => s.song_id === songId)) return
    const nextPos = setlistSongs.length + 1
    const { error } = await supabase.from('setlist_songs').insert({
      setlist_id: selected.id,
      song_id: songId,
      position: nextPos,
    })
    if (error) { showToast('Error adding song', 'error'); return }
    fetchSetlistSongs(selected.id)
  }

  async function removeSongFromSetlist(entry) {
    const { error } = await supabase.from('setlist_songs').delete().eq('id', entry.id)
    if (error) { showToast('Error removing song', 'error'); return }
    // Reorder remaining
    const remaining = setlistSongs.filter(s => s.id !== entry.id)
    await Promise.all(
      remaining.map((s, i) =>
        supabase.from('setlist_songs').update({ position: i + 1 }).eq('id', s.id)
      )
    )
    fetchSetlistSongs(selected.id)
  }

  async function moveUp(index) {
    if (index === 0) return
    const a = setlistSongs[index]
    const b = setlistSongs[index - 1]
    await Promise.all([
      supabase.from('setlist_songs').update({ position: b.position }).eq('id', a.id),
      supabase.from('setlist_songs').update({ position: a.position }).eq('id', b.id),
    ])
    fetchSetlistSongs(selected.id)
  }

  async function moveDown(index) {
    if (index === setlistSongs.length - 1) return
    const a = setlistSongs[index]
    const b = setlistSongs[index + 1]
    await Promise.all([
      supabase.from('setlist_songs').update({ position: b.position }).eq('id', a.id),
      supabase.from('setlist_songs').update({ position: a.position }).eq('id', b.id),
    ])
    fetchSetlistSongs(selected.id)
  }

  const addableSongs = songs.filter(s => !setlistSongs.find(ss => ss.song_id === s.id))

  if (selected) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button className="btn-ghost" onClick={() => setSelected(null)}>← Back</button>
          <h2>{selected.name}</h2>
          {!selected.is_active && (
            <button className="btn-activate" onClick={() => handleSetActive(selected)}>
              Set as live
            </button>
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
                      <button className="btn-icon" onClick={() => moveUp(i)} disabled={i === 0} title="Move up">↑</button>
                      <button className="btn-icon" onClick={() => moveDown(i)} disabled={i === setlistSongs.length - 1} title="Move down">↓</button>
                      <button className="btn-danger btn-sm" onClick={() => removeSongFromSetlist(entry)}>Remove</button>
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
                    <button className="btn-add" onClick={() => addSongToSetlist(song.id)}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      </div>
    )
  }

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
                <span className="song-row-artist">
                  {new Date(sl.service_date).toDateString()}
                </span>
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

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}