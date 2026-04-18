import { SECTION_TYPES, TYPE_LABELS, TYPE_COLORS } from '../../shared/constants/sectionTypes'
import { useState } from 'react'

export default function SectionCard({ section, index, total, onChange, onRemove, onMove, onDuplicate, onDragStart, onDragOver, onDrop, isDragOver }) {
  const colors = TYPE_COLORS[section.type] || TYPE_COLORS.verse
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      draggable
      onDragStart={() => onDragStart(section._key)}
      onDragOver={e => { e.preventDefault(); onDragOver(section._key) }}
      onDrop={e => { e.preventDefault(); onDrop(section._key) }}
      onDragEnd={() => onDrop(null)}
      style={{
        background: '#fff',
        border: `1px solid #e8e7e3`,
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'box-shadow 0.15s, opacity 0.15s',
        boxShadow: isDragOver ? '0 -3px 0 0 #3498db' : 'none',
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

        {/* Duplicate button */}
        <button
          className="btn-icon"
          onClick={e => { e.stopPropagation(); onDuplicate(section._key) }}
          title="Duplicate section"
          style={{ width: 26, height: 26, fontSize: 12 }}
        >
          ⧉
        </button>

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