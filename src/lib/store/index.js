/* global __DEVELOPMENT__ */

import { createStore as createReduxStore, applyMiddleware } from 'redux'
import appsI18nMiddleware from 'lib/middlewares/appsI18n'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { reducers } from 'lib/reducers'
import { createLogger } from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import persistWhitelist from 'config/persistWhitelist'
import logger from '../logger'

const config = {
  storage,
  key: 'cozy-bar',
  whitelist: persistWhitelist
}

const loggerMiddleware = createLogger({
  logger
})

const reducer = persistCombineReducers(config, { ...reducers })

const middlewares = [appsI18nMiddleware, thunkMiddleware]

middlewares.push(loggerMiddleware)

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
