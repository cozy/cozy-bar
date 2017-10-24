import { combineReducers } from 'redux'
import * as content from './content'

export default combineReducers({
  content: content.reducer
})

export const getContent = (state, location) => {
  if (!location) {
    throw new Error('Location must provided')
  }
  return content.getContent(state.content, location)
}
