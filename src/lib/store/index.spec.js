import createStore from '.'
import { isAppListFetching, isAppListForbidden } from '../reducers'

describe('store', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  it('should keep fetching status', () => {
    const getState = () => store.getState()
    expect(isAppListFetching(getState())).toBe(false)
    store.dispatch({ type: 'FETCH_APPS' })
    expect(isAppListFetching(getState())).toBe(true)
    store.dispatch({ type: 'RECEIVE_APP_LIST' })
    expect(isAppListFetching(getState())).toBe(false)
  })

  it('should keep forbidden status', () => {
    expect(true).toBeTruthy()
    const getState = () => store.getState()
    expect(isAppListForbidden(getState())).toBe(false)
    store.dispatch({ type: 'FETCH_APPS' })
    expect(isAppListForbidden(getState())).toBe(false)
    store.dispatch({ type: 'RECEIVE_APP_LIST_FORBIDDEN' })
    expect(isAppListForbidden(getState())).toBe(true)
    store.dispatch({ type: 'RECEIVE_APP_LIST' })
    expect(isAppListForbidden(getState())).toBe(false)
  })
})
