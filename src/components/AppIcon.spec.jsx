import React from 'react'
import { AppIcon } from './AppIcon'
import { shallow } from 'enzyme'

describe('app icon', () => {
  let spyConsoleError, openNativeSpy
  beforeEach(() => {
    spyConsoleError = jest.spyOn(console, 'error')
    spyConsoleError.mockImplementation(message => {
      if (message.lastIndexOf('Warning: Failed prop type:') === 0) {
        throw new Error(message)
      }
    })
    openNativeSpy = jest.spyOn(AppIcon.prototype, 'openNativeApp')
  })

  afterEach(() => {
    spyConsoleError.mockRestore()
    openNativeSpy.mockRestore()
  })

  it('should render correctly', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppIcon app={app} />)
    expect(root).toMatchSnapshot()
  })

  it('should change the onClick handler if native app is available', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppIcon app={app} />)
    root.find('a').simulate('click')
    expect(openNativeSpy).not.toHaveBeenCalled()
    root.setState({ isAppAvailable: true })
    root.find('a').simulate('click')
    expect(openNativeSpy).toHaveBeenCalled()
  })
})
