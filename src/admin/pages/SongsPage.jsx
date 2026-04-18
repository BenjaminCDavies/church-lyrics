import { useState, useRef } from 'react'
import { useSongs } from '../hooks/useSongs'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import SectionCard from '../components/SectionCard'
import AddSectionBar from '../components/AddSectionBar'
import StructurePreview from '../components/StructurePreview'

const EMPTY_SONG = { title: '', artist: '' }

function makeSection(position = 1, type = 'verse') {
  const TYPE_LABELS = { verse: 'Verse', chorus: 'Chorus', bridge: 'Bridge', 'pre-chorus': 'Pre-Chorus', intro: 'Intro', outro: 'Outro', tag: 'Tag' }
  return { _key: crypto.randomUUID(), type, label: type === 'verse' ? 'Verse 1' : TYPE_LABELS[type], content: '', position }
}

export default function SongsPage() {
  const { songs, loading, toast, saveSong, deleteSong, getSongSections } = useSongs()
  const [editing, setEditing] = useState(null)
  const [songForm, setSongForm] = useState(EMPTY_SONG)
  const [sections, setSections] = useState([])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [dragOverKey, setDragOverKey] = useState(null)
  const dragSrcKey = useRef(null)

  async function openNew() {
    setSongForm(EMPTY_SONG)
    setSections([makeSection(1, 'verse')])
    setEditing('new')
  }

  async function openEdit(song) {
    setSongForm({ title: song.title, artist: song.artist || '' })
    const data = await getSongSections(song.id)
    setSections(data)
    setEditing(song)
  }

  function cancelEdit() {
    setEditing(null)
    setSongForm(EMPTY_SONG)
    setSections([])
  }

  function addSection(type) { setSections(prev => [...prev, makeSection(prev.length + 1, type)]) }
  function updateSection(updated) { setSections(prev => prev.map(s => s._key === updated._key ? updated : s)) }
  function removeSection(key) { setSections(prev => prev.filter(s => s._key !== key)) }

  function moveSection(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= sections.length) return
    setSections(prev => {
      const next = [...prev]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }

  function duplicateSection(key) {
    setSections(prev => {
      const idx = prev.findIndex(s => s._key === key)
      if (idx === -1) return prev
      const copy = { ...prev[idx], _key: crypto.randomUUID(), label: prev[idx].label + ' (copy)' }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
  }

  function handleDragStart(key) { dragSrcKey.current = key }

  function handleDragOver(key) {
    if (dragSrcKey.current && dragSrcKey.current !== key) setDragOverKey(key)
  }

  function handleDrop(key) {
    setDragOverKey(null)
    if (!key || !dragSrcKey.current || dragSrcKey.current === key) { dragSrcKey.current = null; return }
    setSections(prev => {
      const srcIdx = prev.findIndex(s => s._key === dragSrcKey.current)
      const tgtIdx = prev.findIndex(s => s._key === key)
      const next = [...prev]
      const [item] = next.splice(srcIdx, 1)
      next.splice(tgtIdx, 0, item)
      return next
    })
    dragSrcKey.current = null
  }

  async function handleSave() {
    if (!songForm.title.trim() || sections.length === 0) return
    setSaving(true)
    const success = await saveSong(songForm, sections, editing)
    setSaving(false)
    if (success) cancelEdit()
  }

  async function handleDelete(song) {
    const success = await deleteSong(song)
    if (success) setConfirmDelete(null)
  }

  // ── Edit / New view ──────────────────────────────────────────────────────

  if (editing) {
    const canSave = songForm.title.trim() && sections.length > 0 && sections.every(s => s.content.trim())

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button className="btn-ghost" onClick={cancelEdit}>← Back</button>
          <h2>{editing === 'new' ? 'Add song' : 'Edit song'}</h2>
        </div>

        <div className="admin-form" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="form-row" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label>Title <span className="required">*</span></label>
              <input type="text" value={songForm.title} onChange={e => setSongForm(f => ({ ...f, title: e.target.value }))} placeholder="Song title" autoFocus />
            </div>
            <div className="form-row" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label>Artist</label>
              <input type="text" value={songForm.artist} onChange={e => setSongForm(f => ({ ...f, artist: e.target.value }))} placeholder="Artist or band (optional)" />
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e7e3', borderRadius: 12, padding: '1.25rem', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', margin: '0 0 6px' }}>
                Song structure
              </h3>
              <StructurePreview sections={sections} />
            </div>
            <span className="muted" style={{ fontSize: 12 }}>{sections.length} {sections.length === 1 ? 'section' : 'sections'}</span>
          </div>

          {sections.length === 0 && (
            <p className="muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>No sections yet. Add one below.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: sections.length ? 12 : 0 }}>
            {sections.map((section, index) => (
              <SectionCard
                key={section._key}
                section={section}
                index={index}
                total={sections.length}
                onChange={updateSection}
                onRemove={removeSection}
                onMove={moveSection}
                onDuplicate={duplicateSection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOverKey === section._key}
              />
            ))}
          </div>

          <AddSectionBar onAdd={addSection} />
        </div>

        <div className="form-actions">
          <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !canSave}>
            {saving ? 'Saving…' : 'Save song'}
          </button>
        </div>

        {!canSave && sections.length > 0 && (
          <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>All sections need lyrics before saving.</p>
        )}

        <Toast toast={toast} />
      </div>
    )
  }

  // ── Song list view ─────────────────────────────────────────────────────────

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