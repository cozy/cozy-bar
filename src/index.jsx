/* global __VERSION__ */

import './styles/index.styl'
import 'cozy-search/dist/stylesheet.css'

export { BarComponent } from './components/BarComponent'
export { BarLeft } from './components/BarLeft'
export { BarRight } from './components/BarRight'
export { BarCenter } from './components/BarCenter'
export { BarTheme } from './components/BarTheme'
export { BarSearch } from './components/BarSearch'
export { default as BarProvider } from './components/BarProvider'
export { reducers as barReducers } from './lib/reducers'

export const version = __VERSION__
