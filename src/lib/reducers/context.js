import stack from 'lib/stack'
import CLAUDY_ACTIONS from 'config/claudyActions.json'
import { LOG_OUT } from 'lib/reducers/settings'

const FETCH_CONTEXT = 'FETCH_CONTEXT'
const FETCH_CONTEXT_SUCCESS = 'FETCH_CONTEXT_SUCCESS'
const RECEIVE_NO_CONTEXT = 'RECEIVE_NO_CONTEXT'

// selectors
export const getHelpLink = state => {
  return state.helpLink
}

export const getClaudyActions = state => {
  return state.claudyActions
}
export const shouldEnableClaudy = state => {
  const claudyActions = getClaudyActions(state)
  return !!claudyActions && !!claudyActions.length
}

// actions
export const fetchContext = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_CONTEXT })
  if (getState().context.contextNotExist) {
    return dispatch({ type: FETCH_CONTEXT_SUCCESS, context: null })
  }
  try {
    const context = await stack.get.context()
    return dispatch({ type: FETCH_CONTEXT_SUCCESS, context })
  } catch (error) {
    if (error.status && error.status === 404) {
      dispatch({ type: RECEIVE_NO_CONTEXT })
    }
    // eslint-disable-next-line no-console
    console.warn('Cannot get Cozy context')
    return null
  }
}

// reducers
const defaultState = {
  claudyActions: [],
  contextNotExist: false,
  helpLink: null,
  isFetching: false
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_CONTEXT:
      return { ...state, isFetching: true }
    case FETCH_CONTEXT_SUCCESS: {
      const attr =
        action.context && action.context.data && action.context.data.attributes
      const contextActions = (attr && attr['claudy_actions']) || []
      // get an arrays of action
      const claudyActions = contextActions
        .map(slug => {
          if (CLAUDY_ACTIONS.hasOwnProperty(slug)) {
            // adding also the action slug
            return Object.assign({}, CLAUDY_ACTIONS[slug], { slug })
          }
        })
        .filter(action => action)
      return {
        ...state,
        helpLink: (attr && attr['help_link']) || null,
        claudyActions,
        isFetching: false,
        contextNotExist: false
      }
    }
    case RECEIVE_NO_CONTEXT:
      return { ...state, contextNotExist: true }
    case LOG_OUT:
      return defaultState
    default:
      return state
  }
}

export default reducer
