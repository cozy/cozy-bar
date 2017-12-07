import { createStore } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { reducers } from '../reducers'
import localForage from 'localforage'

const config = {
  key: 'cozy-bar',
  storage: localForage,
  whitelist: ['locale']
}

const reducer = persistCombineReducers(config, { ...reducers })

const createReduxStore = () => {
  let store = createStore(reducer)
  persistStore(store)

  return store
}

export default createReduxStore
