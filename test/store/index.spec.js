import createStore from 'lib/store'
import { isFetchingApps, getApps, hasFetched } from 'lib/reducers'

describe('store', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  const getState = () => store.getState()

  it('should keep fetching status', () => {
    expect(isFetchingApps(getState())).toBe(true)
    store.dispatch({ type: 'FETCH_APPS' })
    expect(isFetchingApps(getState())).toBe(true)
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: [] })
    expect(isFetchingApps(getState())).toBe(false)
  })

  it('should keep apps data', () => {
    const apps = [{ slug: 'drive' }, { slug: 'banks' }]
    expect(getApps(getState())).toEqual([])
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: apps })
    expect(getApps(getState())).toMatchSnapshot()
  })

  it('should remember it has fetched (ok case)', () => {
    expect(hasFetched(getState())).toEqual(false)
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: [] })
    expect(hasFetched(getState())).toEqual(true)
  })
})
