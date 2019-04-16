// constants
const OPEN_DRAWER = 'OPEN_DRAWER'
const CLOSE_DRAWER = 'CLOSE_DRAWER'

// actions
export const openDrawer = () => ({ type: OPEN_DRAWER })
export const closeDrawer = () => ({ type: CLOSE_DRAWER })

// selectors
export const isDrawerOpen = state => state.isOpen

// reducers
const defaultState = {
  isOpen: false
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_DRAWER:
      return { isOpen: true }

    case CLOSE_DRAWER:
      return { isOpen: false }

    default:
      return state
  }
}

export default reducer
