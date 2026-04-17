import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'

const SECTION_TYPES = ['verse', 'chorus', 'bridge', 'pre-chorus', 'intro', 'outro', 'tag']

const TYPE_LABELS = {
  verse: 'Verse',
  chorus: 'Chorus',
  bridge: 'Bridge',
  'pre-chorus': 'Pre-Chorus',
  intro: 'Intro',
  outro: 'Outro',
  tag: 'Tag',
}

const TYPE_COLORS = {
  verse: { bg: '#f0f4ff', color: '#3a5bd9', border: '#c7d4f7' },
  chorus: { bg: '#fff0f5', color: '#c2185b', border: '#f7c7d8' },
  bridge: { bg: '#f3f0ff', color: '#6d3fc2', border: '#d8c7f7' },
  'pre-chorus': { bg: '#fff7e6', color: '#b45309', border: '#f7e0c7' },
  intro: { bg: '#e6faf4', color: '#0d7a55', border: '#c7f0e0' },
  outro: { bg: '#f5f5f5', color: '#555', border: '#ddd' },
  tag: { bg: '#fdf3e3', color: '#b25a00', border: '#f5d9ab' },
}

function makeSection(position = 1, type = 'verse') {
  const label = type === 'verse' ? 'Verse 1' : TYPE_LABELS[type]
  return {
    _key: crypto.randomUUID(),
    type,
    label,
    content: '',
    position,
  }
}

const EMPTY_SONG = { title: '', artist: '' }

// ── Draggable Section Card ───────────────────────────────────────────────────

function SectionCard({ section, index, total, onChange, onRemove, onMove, dragHandleProps }) {
  const colors = TYPE_COLORS[section.type] || TYPE_COLORS.verse
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid #e8e7e3`,
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          background: '#fafaf8',
          borderBottom: collapsed ? 'none' : '1px solid #f0efeb',
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        {/* Drag handle */}
        <span
          {...dragHandleProps}
          onClick={e => e.stopPropagation()}
          style={{
            cursor: 'grab',
            color: '#bbb',
            fontSize: 16,
            lineHeight: 1,
            padding: '2px 4px',
            borderRadius: 4,
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          ⠿
        </span>

        {/* Type badge */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 20,
            background: colors.bg,
            color: colors.color,
            border: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          {TYPE_LABELS[section.type]}
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#444',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {section.label || '\u00a0'}
        </span>

        {/* Move up/down */}
        <div
          style={{ display: 'flex', gap: 2, flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="btn-icon"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            title="Move up"
            style={{ width: 26, height: 26, fontSize: 12 }}
          >
            ↑
          </button>
          <button
            className="btn-icon"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
            title="Move down"
            style={{ width: 26, height: 26, fontSize: 12 }}
          >
            ↓
          </button>
        </div>

        {/* Collapse chevron */}
        <span style={{ color: '#bbb', fontSize: 12, flexShrink: 0, transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.15s' }}>
          ▾
        </span>
      </div>

      {/* Card body */}
      {!collapsed && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Type selector */}
            <div style={{ flex: '0 0 auto' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 4 }}>
                Type
              </label>
              <select
                value={section.type}
                onChange={e => onChange({ ...section, type: e.target.value })}
                style={{
                  padding: '6px 10px',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  border: '1px solid #ddd',
                  borderRadius: 7,
                  background: '#fff',
                  color: '#1a1a1a',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SECTION_TYPES.map(t => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {/* Label input */}
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 4 }}>
                Label
              </label>
              <input
                type="text"
                value={section.label}
                onChange={e => onChange({ ...section, label: e.target.value })}
                placeholder="e.g. Verse 1, Chorus"
                style={{ margin: 0 }}
              />
            </div>

            {/* Remove button */}
            <div style={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
              <button
                className="btn-danger btn-sm"
                onClick={() => onRemove(section._key)}
                style={{ marginBottom: 1 }}
              >
                Remove
              </button>
            </div>
          </div>

          {/* Content textarea */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 4 }}>
              Lyrics
            </label>
            <textarea
              value={section.content}
              onChange={e => onChange({ ...section, content: e.target.value })}
              placeholder={`Enter ${TYPE_LABELS[section.type].toLowerCase()} lyrics…`}
              rows={6}
              style={{ margin: 0, fontFamily: 'inherit', fontSize: 13, lineHeight: 1.7 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Add Section Bar ──────────────────────────────────────────────────────────

function AddSectionBar({ onAdd }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        padding: '12px 14px',
        background: '#fafaf8',
        border: '1px dashed #d8d7d3',
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: 12, color: '#999', fontWeight: 500, marginRight: 4 }}>Add section:</span>
      {SECTION_TYPES.map(type => {
        const colors = TYPE_COLORS[type]
        return (
          <button
            key={type}
            onClick={() => onAdd(type)}
            style={{
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 20,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              color: colors.color,
              cursor: 'pointer',
              transition: 'filter 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.94)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          >
            + {TYPE_LABELS[type]}
          </button>
        )
      })}
    </div>
  )
}

// ── Section Structure Preview ────────────────────────────────────────────────

function StructurePreview({ sections }) {
  if (!sections.length) return null
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {sections.map((s, i) => {
        const colors = TYPE_COLORS[s.type] || TYPE_COLORS.verse
        return (
          <span
            key={s._key}
            style={{
              fontSize: 11,
              padding: '2px 7px',
              borderRadius: 20,
              background: colors.bg,
              color: colors.color,
              border: `1px solid ${colors.border}`,
              fontWeight: 500,
            }}
          >
            {s.label || TYPE_LABELS[s.type]}
          </span>
        )
      })}
    </div>
  )
}

// ── Main SongsPage ───────────────────────────────────────────────────────────

export default function SongsPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null | 'new' | song object
  const [songForm, setSongForm] = useState(EMPTY_SONG)
  const [sections, setSections] = useState([])
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

  async function openNew() {
    setSongForm(EMPTY_SONG)
    setSections([makeSection(1, 'verse')])
    setEditing('new')
  }

  async function openEdit(song) {
    setSongForm({ title: song.title, artist: song.artist || '' })
    // Load existing sections
    const { data } = await supabase
      .from('song_sections')
      .select('*')
      .eq('song_id', song.id)
      .order('position')
    setSections(
      (data || []).map(s => ({ ...s, _key: s.id }))
    )
    setEditing(song)
  }

  function cancelEdit() {
    setEditing(null)
    setSongForm(EMPTY_SONG)
    setSections([])
  }

  function addSection(type) {
    setSections(prev => [...prev, makeSection(prev.length + 1, type)])
  }

  function updateSection(updated) {
    setSections(prev => prev.map(s => s._key === updated._key ? updated : s))
  }

  function removeSection(key) {
    setSections(prev => prev.filter(s => s._key !== key))
  }

  function moveSection(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= sections.length) return
    setSections(prev => {
      const next = [...prev]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }

  async function handleSave() {
    if (!songForm.title.trim()) return
    if (sections.length === 0) return
    setSaving(true)

    const payload = {
      title: songForm.title.trim(),
      artist: songForm.artist.trim() || null,
    }

    let songId
    let error

    if (editing === 'new') {
      const { data, error: e } = await supabase
        .from('songs')
        .insert(payload)
        .select()
        .single()
      error = e
      songId = data?.id
    } else {
      ;({ error } = await supabase
        .from('songs')
        .update(payload)
        .eq('id', editing.id))
      songId = editing.id
    }

    if (error) {
      setSaving(false)
      showToast('Error saving song', 'error')
      return
    }

    // Replace all sections for this song
    await supabase.from('song_sections').delete().eq('song_id', songId)
    const { error: sectionsError } = await supabase.from('song_sections').insert(
      sections.map((s, i) => ({
        song_id: songId,
        type: s.type,
        label: s.label,
        content: s.content,
        position: i + 1,
      }))
    )

    setSaving(false)

    if (sectionsError) {
      showToast('Song saved but sections failed', 'error')
      return
    }

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

  // ── Edit / New view ──────────────────────────────────────────────────────

  if (editing) {
    const canSave = songForm.title.trim() && sections.length > 0 && sections.every(s => s.content.trim())

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button className="btn-ghost" onClick={cancelEdit}>← Back</button>
          <h2>{editing === 'new' ? 'Add song' : 'Edit song'}</h2>
        </div>

        {/* Song meta */}
        <div className="admin-form" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="form-row" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                value={songForm.title}
                onChange={e => setSongForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Song title"
                autoFocus
              />
            </div>
            <div className="form-row" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label>Artist</label>
              <input
                type="text"
                value={songForm.artist}
                onChange={e => setSongForm(f => ({ ...f, artist: e.target.value }))}
                placeholder="Artist or band (optional)"
              />
            </div>
          </div>
        </div>

        {/* Sections editor */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e8e7e3',
            borderRadius: 12,
            padding: '1.25rem',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#888',
                  margin: '0 0 6px',
                }}
              >
                Song structure
              </h3>
              <StructurePreview sections={sections} />
            </div>
            <span className="muted" style={{ fontSize: 12 }}>
              {sections.length} {sections.length === 1 ? 'section' : 'sections'}
            </span>
          </div>

          {sections.length === 0 && (
            <p className="muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              No sections yet. Add one below.
            </p>
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
                dragHandleProps={{}}
              />
            ))}
          </div>

          <AddSectionBar onAdd={addSection} />
        </div>

        {/* Save / cancel */}
        <div className="form-actions">
          <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !canSave}
          >
            {saving ? 'Saving…' : 'Save song'}
          </button>
        </div>

        {!canSave && sections.length > 0 && (
          <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            All sections need lyrics before saving.
          </p>
        )}

        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
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