const SET_CONTENT = 'SET_CONTENT'
const UNSET_CONTENT = 'UNSET_CONTENT'

const getLastItemInMap = map => Array.from(map)[map.size - 1]

// action creator
export const setContent = (location, content, id) => ({
  type: SET_CONTENT,
  location,
  content,
  id
})
export const unsetContent = (location, id) => ({
  type: UNSET_CONTENT,
  location,
  id
})

// reducer
export const getDefaultState = () => ({
  left: new Map(),
  center: new Map(),
  right: new Map()
})

export const reducer = (state = getDefaultState(), action) => {
  if (!action.location || typeof action.id === undefined) return state
  switch (action.type) {
    case SET_CONTENT: {
      const currentState = state[action.location]
      currentState.set(action.id, action.content)
      return { ...state, [action.location]: currentState }
    }
    case UNSET_CONTENT: {
      const currentState = state[action.location]
      if (!currentState.get(action.id)) {
        return state
      }
      currentState.delete(action.id)
      return { ...state, [action.location]: currentState }
    }
    default:
      return state
  }
}

// selectors
export const getContent = (state, location) =>
  getLastItemInMap(state[location]) && getLastItemInMap(state[location])[1]
