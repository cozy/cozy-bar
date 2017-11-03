import { combineReducers } from 'redux'
import * as content from './content'
import * as locale from './locale'

export default combineReducers({
  content: content.reducer,
  locale: locale.reducer
})

const proxy = function (attr, method) {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

export const getContent = proxy('content', content.getContent)
export const getLocale = proxy('locale', locale.getLocale)
