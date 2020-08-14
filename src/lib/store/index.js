import { createStore as createReduxStore, applyMiddleware } from 'redux'
import appsI18nMiddleware from 'lib/middlewares/appsI18n'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { reducers } from 'lib/reducers'
import { createLogger } from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import persistWhitelist from 'config/persistWhitelist'
import logger from '../logger'
import flag from 'cozy-flags'

const config = {
  storage,
  key: 'cozy-bar',
  whitelist: persistWhitelist
}

// copied and changed from https://github.com/LogRocket/redux-logger/blob/3ca9f2c1ecf17a7acf18c6fa0bbf4b6b239738f1/src/core.js#L25
function barTitleFormatter(action, time) {
  const parts = ['[COZY-BAR]']

  parts.push(`${String(action.type)}`)
  if (time) parts.push(`@ ${time}`)

  return parts.join(' ')
}

const loggerMiddleware = createLogger({
  titleFormatter: barTitleFormatter,
  logger
})

const reducer = persistCombineReducers(config, { ...reducers })

const middlewares = [appsI18nMiddleware, thunkMiddleware]

if (flag('bar.redux-logger')) {
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
