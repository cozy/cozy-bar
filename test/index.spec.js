import { init } from '../src'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('The bar library', function() {
  xit('should render correctly the cozy-bar', () => {
    // Set up our document body
    document.body.innerHTML =
      '<div role="application">' + '  The application will be here' + '</div>'
    const options = {
      appName: 'test-app',
      appNamePrefix: 'cozy',
      lang: 'en',
      iconPath: '',
      cozyURL: 'https://mock.cozy',
      token: 'mock'
    }
    const Bar = init(options)
    const mounted = mount(Bar)
    expect(mounted.getElement()).toMatchSnapshot()
  })
})
