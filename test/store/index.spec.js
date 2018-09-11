import createStore from 'lib/store'
import {
  isAppListFetching,
  getApps,
  setInfos,
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
    store.dispatch({ type: 'RECEIVE_APP_LIST' })
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
    store.dispatch({ type: 'RECEIVE_APP_LIST' })
    expect(hasFetched(getState())).toEqual(true)
  })

  it('should remember it has fetched (bad case)', () => {
    expect(hasFetched(getState())).toEqual(false)
    store.dispatch({ type: 'RECEIVE_APP_LIST_FORBIDDEN' })
    expect(hasFetched(getState())).toEqual(false)
  })

  it('should not return current app on mobile', () => {
    const apps = [
      { slug: 'drive', appName: 'Cozy Drive', comingSoon: true, name_prefix: 'cozydrive://' },
      {slug: 'banks'}
    ]
    const onMobile = true
    store.dispatch(setInfos('Cozy Drive', 'cozydrive://'))
    expect(getApps(getState(), onMobile)).toEqual([])
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: apps })
    expect(getApps(getState(), onMobile)).toEqual([apps[1]])
  })
})
