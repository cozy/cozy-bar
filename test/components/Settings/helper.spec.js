import { isFetching } from 'components/Settings/helper'

describe('Settings Helper', () => {
  it('should return true if isFetching', () => {
    const fakeRequest1 = {
      fetchStatus: 'loading'
    }
    const fakeRequest2 = {
      fetchStatus: 'loaded'
    }
    expect(isFetching([fakeRequest1, fakeRequest2])).toBe(true)
  })

  it('should not return true if not fetching', () => {
    const fakeRequest1 = {
      fetchStatus: 'loaded'
    }
    const fakeRequest2 = {
      fetchStatus: 'loaded'
    }
    expect(isFetching([fakeRequest1, fakeRequest2])).toBe(false)
  })
})
