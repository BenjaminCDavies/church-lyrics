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