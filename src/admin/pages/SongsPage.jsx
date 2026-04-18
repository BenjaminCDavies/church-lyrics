import { useState } from 'react'
import { useSongs } from '../hooks/useSongs'
import SongEditor from './SongEditor'
import SongListView from './SongListView'

export default function SongsPage() {
  const { songs, loading, toast, saveSong, deleteSong, getSongSections } = useSongs()
  const [editing, setEditing] = useState(null)       // null | 'new' | song object
  const [initialSections, setInitialSections] = useState([])

  async function openNew() {
    setInitialSections([])
    setEditing('new')
  }

  async function openEdit(song) {
    const data = await getSongSections(song.id)
    setInitialSections(data)
    setEditing(song)
  }

  function handleCancel() {
    setEditing(null)
    setInitialSections([])
  }

  async function handleSave(songForm, sections) {
    const success = await saveSong(songForm, sections, editing)
    if (success) handleCancel()
  }

  if (editing) {
    return (
      <SongEditor
        editing={editing}
        initialSections={initialSections}
        onSave={handleSave}
        onCancel={handleCancel}
        toast={toast}
      />
    )
  }

  return (
    <SongListView
      songs={songs}
      loading={loading}
      toast={toast}
      onAdd={openNew}
      onEdit={openEdit}
      onDelete={deleteSong}
    />
  )
}