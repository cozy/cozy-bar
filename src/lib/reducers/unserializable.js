const SET_WEBVIEW_CONTEXT = 'SET_WEBVIEW_CONTEXT'

// selectors
export const getWebviewContext = state => {
  return state.webviewContext
}

// actions
export const setWebviewContext = payload => ({
  type: SET_WEBVIEW_CONTEXT,
  payload
})

// reducers
const defaultState = {
  webviewContext: undefined
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_WEBVIEW_CONTEXT:
      return { ...state, webviewContext: action.payload }
    default:
      return state
  }
}
