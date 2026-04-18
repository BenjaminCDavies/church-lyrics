import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { useState } from 'react'

export default function SongListView({ songs, loading, toast, onEdit, onAdd, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)

  async function handleDelete(song) {
    const success = await onDelete(song)
    if (success) setConfirmDelete(null)
  }

  if (loading) return <p className="muted">Loading…</p>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Songs</h2>
        <button className="btn-primary" onClick={onAdd}>+ Add song</button>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <p>No songs yet.</p>
          <button className="btn-primary" onClick={onAdd}>Add your first song</button>
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
                <button className="btn-ghost btn-sm" onClick={() => onEdit(song)}>Edit</button>
                <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(song)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title={`Delete "${confirmDelete.title}"?`}
          body="This will also remove it from any setlists."
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  )
}