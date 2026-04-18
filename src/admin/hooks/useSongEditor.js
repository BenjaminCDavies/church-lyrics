import { useState, useRef } from 'react'
import { TYPE_LABELS } from '../../shared/constants/sectionTypes'

function makeSection(position = 1, type = 'verse') {
  return {
    _key: crypto.randomUUID(),
    type,
    label: type === 'verse' ? 'Verse 1' : TYPE_LABELS[type],
    content: '',
    position,
  }
}

export function useSongEditor(initialSections = []) {
  const defaultSections = initialSections.length > 0
    ? initialSections
    : [makeSection(1, 'verse')]
  const [sections, setSections] = useState(defaultSections)
  const [dragOverKey, setDragOverKey] = useState(null)
  const dragSrcKey = useRef(null)

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
    if (!key || !dragSrcKey.current || dragSrcKey.current === key) {
      dragSrcKey.current = null
      return
    }
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

  return {
    sections,
    dragOverKey,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    duplicateSection,
    handleDragStart,
    handleDragOver,
    handleDrop,
  }
}