import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import 'babel-polyfill'

// polyfill for requestAnimationFrame
/* istanbul ignore next */
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}

Enzyme.configure({ adapter: new Adapter() })

process.env.USE_REACT = true
