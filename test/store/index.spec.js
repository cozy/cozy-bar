import createStore from 'lib/store'
import {
  isAppListFetching,
  getApps,
  hasFetched
} from 'lib/reducers'

describe('store', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  const getState = () => store.getState()

  it('should keep fetching status', () => {
    expect(isAppListFetching(getState())).toBe(false)
    store.dispatch({ type: 'FETCH_APPS' })
    expect(isAppListFetching(getState())).toBe(true)
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: [] })
    expect(isAppListFetching(getState())).toBe(false)
  })

  it('should keep apps data', () => {
    const apps = [{ slug: 'drive' }, {slug: 'banks'}]
    expect(getApps(getState())).toEqual([])
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: apps })
    expect(getApps(getState())).toEqual(apps)
  })

  it('should remember it has fetched (ok case)', () => {
    expect(hasFetched(getState())).toEqual(false)
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: [] })
    expect(hasFetched(getState())).toEqual(true)
  })
})
