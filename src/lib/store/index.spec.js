import createStore from '.'
import {
  isAppListFetching,
  isAppListForbidden,
  getApps,
  setInfos
} from '../reducers'

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

  it('should keep forbidden status', () => {
    expect(isAppListForbidden(getState())).toBe(false)
    store.dispatch({ type: 'RECEIVE_APP_LIST_FORBIDDEN' })
    expect(isAppListForbidden(getState())).toBe(true)
    store.dispatch({ type: 'RECEIVE_APP_LIST' })
    expect(isAppListForbidden(getState())).toBe(false)
  })

  it('should keep apps data', () => {
    const apps = [{ slug: 'drive' }, {slug: 'banks'}]
    expect(getApps(getState())).toEqual([])
    store.dispatch({ type: 'RECEIVE_APP_LIST', apps: apps })
    expect(getApps(getState())).toEqual(apps)
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
