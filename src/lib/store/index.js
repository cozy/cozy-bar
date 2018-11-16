/* global __DEVELOPMENT__ */

import { createStore as createReduxStore, applyMiddleware } from 'redux'
import appsI18nMiddleware from '../middlewares/appsI18n'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { reducers } from '../reducers'
import { createLogger } from 'redux-logger'
import storage from 'redux-persist/lib/storage'

const config = {
  storage,
  key: 'cozy-bar',
  whitelist: ['locale']
}

const loggerMiddleware = createLogger()

const reducer = persistCombineReducers(config, { ...reducers })

const middlewares = [appsI18nMiddleware, thunkMiddleware]

if (__DEVELOPMENT__) middlewares.push(loggerMiddleware)

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
