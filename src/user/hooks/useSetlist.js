import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export function useSetlist() {
  const [setlist, setSetlist] = useState(null)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadActiveSetlist() {
      try {
        setLoading(true)
        // Fetch the active setlist
        const { data: setlistData, error: setlistError } = await supabase
          .from('weekly_setlists')
          .select('*')
          .eq('is_active', true)
          .single()

        if (setlistError) throw setlistError
        if (!setlistData) {
          setLoading(false)
          return
        }
        
        setSetlist(setlistData)

        // Fetch the songs in that setlist, ordered by position
        const { data: setlistSongs, error: songsError } = await supabase
          .from('setlist_songs')
          .select('position, songs(*, song_sections(*))')
          .eq('setlist_id', setlistData.id)
          .order('position', { ascending: true })

        if (songsError) throw songsError

        setSongs(
          setlistSongs.map(s => {
            const { song_sections, sections: _discard, ...songFields } = s.songs
            return {
              ...songFields,
              sections: (song_sections || [])
              .sort((a, b) => a.position - b.position),
            }
          })
        )

      } catch (err) {
        console.error('Error fetching setlist:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadActiveSetlist()
  }, [])

  return { setlist, songs, loading, error }
}
