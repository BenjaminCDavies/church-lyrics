import { useState, useEffect } from 'react'
import { supabase } from '../../shared/lib/supabaseClient'
import { useToast } from './useToast'

export function useSongs() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast } = useToast()

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

  async function saveSong(songForm, sections, editing) {
    const payload = {
      title: songForm.title.trim(),
      artist: songForm.artist.trim() || null,
    }

    let songId, error

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

    if (error) { showToast('Error saving song', 'error'); return false }

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

    if (sectionsError) { showToast('Song saved but sections failed', 'error'); return false }

    showToast(editing === 'new' ? 'Song added' : 'Song updated')
    fetchSongs()
    return true
  }

  async function deleteSong(song) {
    const { error } = await supabase.from('songs').delete().eq('id', song.id)
    if (error) { showToast('Error deleting song', 'error'); return false }
    showToast('Song deleted')
    fetchSongs()
    return true
  }

  async function getSongSections(songId) {
    const { data } = await supabase
      .from('song_sections')
      .select('*')
      .eq('song_id', songId)
      .order('position')
    return (data || []).map(s => ({ ...s, _key: s.id }))
  }

  return { songs, loading, toast, showToast, saveSong, deleteSong, getSongSections }
}