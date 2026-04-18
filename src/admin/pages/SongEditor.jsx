import { useState } from 'react'
import SectionCard from '../components/SectionCard'
import AddSectionBar from '../components/AddSectionBar'
import StructurePreview from '../components/StructurePreview'
import Toast from '../components/Toast'
import { useSongEditor } from '../hooks/useSongEditor'

const EMPTY_SONG = { title: '', artist: '' }

export default function SongEditor({ editing, initialSections, onSave, onCancel, toast }) {
  const [songForm, setSongForm] = useState(
    editing === 'new'
      ? EMPTY_SONG
      : { title: editing.title, artist: editing.artist || '' }
  )
  const [saving, setSaving] = useState(false)

  const {
    sections, dragOverKey,
    addSection, updateSection, removeSection,
    moveSection, duplicateSection,
    handleDragStart, handleDragOver, handleDrop,
  } = useSongEditor(initialSections)

  const canSave = songForm.title.trim() && sections.length > 0 && sections.every(s => s.content.trim())

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await onSave(songForm, sections)
    setSaving(false)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <button className="btn-ghost" onClick={onCancel}>← Back</button>
        <h2>{editing === 'new' ? 'Add song' : 'Edit song'}</h2>
      </div>

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

      <div style={{ background: '#fff', border: '1px solid #e8e7e3', borderRadius: 12, padding: '1.25rem', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', margin: '0 0 6px' }}>
              Song structure
            </h3>
            <StructurePreview sections={sections} />
          </div>
          <span className="muted" style={{ fontSize: 12 }}>
            {sections.length} {sections.length === 1 ? 'section' : 'sections'}
          </span>
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
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
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