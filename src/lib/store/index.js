import { createStore as createReduxStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { reducers } from 'lib/reducers'
import { createLogger } from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import persistWhitelist from 'config/persistWhitelist.json'
import logger from '../logger'
import flag from 'cozy-flags'

const config = {
  storage,
  key: 'cozy-bar',
  whitelist: persistWhitelist
}

const loggerMiddleware = createLogger({
  logger
})

const reducer = persistCombineReducers(config, { ...reducers })

const middlewares = [thunkMiddleware]

if (flag('bar.debug')) {
  middlewares.push(loggerMiddleware)
}

export const createStore = () => {
  store = createReduxStore(reducer, applyMiddleware.apply(null, middlewares))
  persistStore(store)
  return store
}

let store
const getOrCreateStore = () => {
  if (!store) {
    store = createStore()
  }
  return store
}

export default getOrCreateStore
