import {
  isFetchingQueries,
  cozyClientCanCheckPremium
} from 'components/Settings/helper'

describe('Settings Helper', () => {
  it('should return true if isFetchingQueries', () => {
    const fakeRequest1 = {
      fetchStatus: 'loading'
    }
    const fakeRequest2 = {
      fetchStatus: 'loaded'
    }
    expect(isFetchingQueries([fakeRequest1, fakeRequest2])).toBe(true)
  })

  it('should not return true if not fetching', () => {
    const fakeRequest1 = {
      fetchStatus: 'loaded'
    }
    const fakeRequest2 = {
      fetchStatus: 'loaded'
    }
    expect(isFetchingQueries([fakeRequest1, fakeRequest2])).toBe(false)
  })

  it('should return true for cozyClientCanCheckPremium', () => {
    const CozyClient = {
      version: '6.7.8'
    }

    expect(cozyClientCanCheckPremium(CozyClient)).toBe(false)
    expect(cozyClientCanCheckPremium({ version: '10.7.8' })).toBe(true)
    //we expect the current CozyClient version is OK
    expect(cozyClientCanCheckPremium()).toBe(true)
  })
})
