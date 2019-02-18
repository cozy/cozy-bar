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
export const getDefaultTheme = () => DEFAULT_THEME

export const reducer = (state = getDefaultTheme(), action) => {
  if (action.type === SET_THEME) {
    if (THEMES.includes(action.theme)) {
      return action.theme
    }
    return DEFAULT_THEME
  } else {
    return state
  }
}

// selector
export const getTheme = state => state
