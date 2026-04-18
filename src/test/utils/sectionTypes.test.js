import { SECTION_TYPES, TYPE_LABELS, TYPE_COLORS } from '../../shared/constants/sectionTypes'

describe('sectionTypes constants', () => {
  it('SECTION_TYPES is a non-empty array', () => {
    expect(Array.isArray(SECTION_TYPES)).toBe(true)
    expect(SECTION_TYPES.length).toBeGreaterThan(0)
  })

  it('every SECTION_TYPE has a label', () => {
    SECTION_TYPES.forEach(type => {
      expect(TYPE_LABELS[type]).toBeDefined()
      expect(typeof TYPE_LABELS[type]).toBe('string')
    })
  })

  it('every SECTION_TYPE has color config with bg, color, and border', () => {
    SECTION_TYPES.forEach(type => {
      expect(TYPE_COLORS[type]).toMatchObject({
        bg: expect.any(String),
        color: expect.any(String),
        border: expect.any(String),
      })
    })
  })
})