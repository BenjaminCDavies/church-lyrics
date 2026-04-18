import { renderHook, act } from '@testing-library/react'
import { useToast } from '../../admin/hooks/useToast'

describe('useToast', () => {
  it('starts with no toast', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toast).toBeNull()
  })

  it('shows a success toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Song saved')
    })

    expect(result.current.toast).toEqual({ msg: 'Song saved', type: 'success' })
  })

  it('shows an error toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Something went wrong', 'error')
    })

    expect(result.current.toast).toEqual({ msg: 'Something went wrong', type: 'error' })
  })
})