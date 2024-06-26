import stack from 'lib/stack'

const FETCH_SETTINGS = 'FETCH_SETTINGS'
const FETCH_SETTINGS_BUSY = 'FETCH_SETTINGS_BUSY'
const FETCH_SETTINGS_SUCCESS = 'FETCH_SETTINGS_SUCCESS'
const RECEIVE_NO_CONTEXT = 'RECEIVE_NO_CONTEXT'
const RECEIVE_STORAGE = 'RECEIVE_STORAGE'

export const LOG_OUT = 'LOG_OUT'

const BUSY_DELAY = 450

// selectors
export const getStorageData = state => {
  return state.storageData
}
export const isSettingsBusy = state => {
  return state.isBusy
}
export const isFetchingSettings = state => {
  return state.isFetching
}

// actions
const fetchStorageData = () => async dispatch => {
  try {
    const storageData = await stack.get.storageData()
    return dispatch({ type: RECEIVE_STORAGE, storageData })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn && console.warn('Cannot get Cozy storage informations')
    return null
  }
}

export const fetchSettingsData = (displayBusy = true) => async dispatch => {
  dispatch({ type: FETCH_SETTINGS })
  // put the busy status after BUSY_DELAY secs
  const busySpinner = setTimeout(() => {
    // we do not display the busy status in the drawer
    if (displayBusy) dispatch({ type: FETCH_SETTINGS_BUSY })
  }, BUSY_DELAY)
  await dispatch(fetchStorageData())
  clearTimeout(busySpinner)
  dispatch({ type: FETCH_SETTINGS_SUCCESS })
}

export const logOut = () => async dispatch => {
  dispatch({ type: LOG_OUT })
  try {
    await stack.logout()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error while logging out in the cozy-bar', e)
  }
}

// reducers
const defaultState = {
  contextNotExist: false,
  isFetching: false,
  isBusy: false,
  storageData: null
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_SETTINGS:
      return { ...state, isFetching: true }
    case FETCH_SETTINGS_BUSY:
      return { ...state, isBusy: true }
    case FETCH_SETTINGS_SUCCESS:
      return { ...state, isFetching: false, isBusy: false }
    case RECEIVE_NO_CONTEXT:
      return { ...state, contextNotExist: true }
    case RECEIVE_STORAGE:
      return { ...state, storageData: action.storageData }
    case LOG_OUT:
      return defaultState
    default:
      return state
  }
}

export default reducer
