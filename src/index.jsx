/* global __VERSION__ */

import './styles/index.styl'

export { BarComponent } from './components/BarComponent'
export { BarLeft } from './components/BarLeft'
export { BarRight } from './components/BarRight'
export { BarCenter } from './components/BarCenter'
export { BarSearch } from './components/BarSearch'
export { BarProvider, useBarContext } from './components/BarProvider'

export const version = __VERSION__
