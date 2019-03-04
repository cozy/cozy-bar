const SET_THEME = 'SET_THEME'
const DEFAULT_THEME = 'default'
const PRIMARY_THEME = 'primary'
const THEMES = [DEFAULT_THEME, PRIMARY_THEME]
const EMPTY_OVERRIDES = {}

// Theme state is { name, overrides }
// where both have the form described in `setTheme`
const DEFAULT_STATE = {name: DEFAULT_THEME, overrides: EMPTY_OVERRIDES}

/**
 * Change the cozy-bar theme
 * 
 * Today, the value 'primary' will change the background color
 * of the bar in the mobile view. It will then use the 
 * `--primaryColor` CSS variable and the `--primaryContrastTextColor`
 * for the text.
 * 
 * @function
 * @param {String} name - either 'default' or 'primary'
 * @param {Object} overrides - overrides of default values for the theme
 *                             default to an empty object (no overrides)
 *                             It will only overrides the values for the 
 *                             'primary' specific theme/view
 * @param {Object} overrides.primaryColor - the background color
 * @param {Object} overrides.primaryContrastTextColor - the text color
 * @returns {Object} action `{ type: SET_THEME, theme: {name, overrides} }
 */
export const setTheme = (name, overrides=EMPTY_OVERRIDES) => ({
  type: SET_THEME,
  theme: { name, overrides }
})

export const getDefaultTheme = () => DEFAULT_STATE
 
export const reducer = (state = getDefaultTheme(), action) => {
  if (action.type === SET_THEME) {
    if (THEMES.includes(action.theme.name)) {
      return action.theme
    }
    return {...action.theme, name: DEFAULT_THEME }
  } else {
    return state
  }
}

// selector
export const getTheme = state => state
