import { TYPE_LABELS, TYPE_COLORS } from '../../shared/constants/sectionTypes'

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