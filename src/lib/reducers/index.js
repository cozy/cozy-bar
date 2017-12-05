import { combineReducers } from 'redux'
import * as content from './content'
import * as locale from './locale'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const setContent = content.setContent
const setLocale = locale.setLocale
export { setContent, setLocale }

export const getContent = proxy('content', content.getContent)
export const getLocale = proxy('locale', locale.getLocale)

export const reducers = {
  content: content.reducer,
  locale: locale.reducer
}

export default combineReducers(reducers)
