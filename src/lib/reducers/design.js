const SET_THEME = 'SET_THEME'
const DEFAULT_THEME = 'default'
const PRIMARY_THEME = 'primary'
const THEMES = [DEFAULT_THEME, PRIMARY_THEME]

// action creator
export const setTheme = theme => ({
  type: SET_THEME,
  theme
})

// reducer
export const getDefaultState = () => ({
  theme: DEFAULT_THEME
})

export const reducer = (state = getDefaultState(), action) => {
  switch (action.type) {
    case SET_THEME:
      if (THEMES.includes(action.theme)) {
        return { ...state, theme: action.theme }
      }
      return { ...state, theme: DEFAULT_THEME }
    default:
      return state
  }
}

// selector
export const getTheme = state => state.theme
