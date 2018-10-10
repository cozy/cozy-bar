const SET_CONTENT = 'SET_CONTENT'

// action creator
export const setContent = (location, content) => ({
  type: SET_CONTENT,
  location,
  content
})

// reducer
const defaultState = {
  left: null,
  center: null,
  right: null
}

export const reducer = (state = defaultState, action) => {
  if (
    action.type === SET_CONTENT &&
    state[action.location] !== action.content
  ) {
    return { ...state, [action.location]: action.content }
  } else {
    return state
  }
}

// selectors
export const getContent = (state, location) => state[location]
