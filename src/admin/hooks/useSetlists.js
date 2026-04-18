import { useState, useEffect } from 'react'
import { supabase } from '../../shared/lib/supabaseClient'
import { useToast } from './useToast'

export function useSetlists() {
  const [setlists, setSetlists] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [setlistSongs, setSetlistSongs] = useState([])
  const { toast, showToast } = useToast()

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

  async function createSetlist(form) {
    const { error } = await supabase.from('weekly_setlists').insert({
      name: form.name.trim(),
      service_date: form.service_date,
      is_active: false,
    })
    if (error) { showToast('Error creating setlist', 'error'); return false }
    showToast('Setlist created')
    fetchAll()
    return true
  }

  async function setActive(sl) {
    await supabase.from('weekly_setlists').update({ is_active: false }).neq('id', sl.id)
    const { error } = await supabase.from('weekly_setlists').update({ is_active: true }).eq('id', sl.id)
    if (error) { showToast('Error setting active', 'error'); return false }
    showToast(`"${sl.name}" is now live`)
    fetchAll()
    return true
  }

  async function deleteSetlist(sl) {
    const { error } = await supabase.from('weekly_setlists').delete().eq('id', sl.id)
    if (error) { showToast('Error deleting setlist', 'error'); return false }
    showToast('Setlist deleted')
    fetchAll()
    return true
  }

  async function addSong(setlistId, songId, currentCount) {
    const { error } = await supabase.from('setlist_songs').insert({
      setlist_id: setlistId,
      song_id: songId,
      position: currentCount + 1,
    })
    if (error) { showToast('Error adding song', 'error'); return false }
    fetchSetlistSongs(setlistId)
    return true
  }

  async function removeSong(entry, setlistId, remaining) {
    const { error } = await supabase.from('setlist_songs').delete().eq('id', entry.id)
    if (error) { showToast('Error removing song', 'error'); return false }
    await Promise.all(
      remaining.map((s, i) =>
        supabase.from('setlist_songs').update({ position: i + 1 }).eq('id', s.id)
      )
    )
    fetchSetlistSongs(setlistId)
    return true
  }

  async function moveSong(a, b, setlistId) {
    await Promise.all([
      supabase.from('setlist_songs').update({ position: b.position }).eq('id', a.id),
      supabase.from('setlist_songs').update({ position: a.position }).eq('id', b.id),
    ])
    fetchSetlistSongs(setlistId)
  }

  return {
    setlists, songs, loading, setlistSongs, toast, showToast,
    fetchSetlistSongs, createSetlist, setActive, deleteSetlist,
    addSong, removeSong, moveSong,
  }
}