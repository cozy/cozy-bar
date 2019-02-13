import React from 'react'
import { AppItem } from 'components/Apps/AppItem'
import { shallow } from 'enzyme'
import { tMock } from '../jestLib/I18n'

describe('app icon', () => {
  let spyConsoleError, openNativeSpy
  beforeEach(() => {
    global.__TARGET__ = 'browser'
    spyConsoleError = jest.spyOn(console, 'error')
    spyConsoleError.mockImplementation(message => {
      if (message.lastIndexOf('Warning: Failed prop type:') === 0) {
        throw new Error(message)
      }
    })
    openNativeSpy = jest.spyOn(AppItem.prototype, 'openNativeApp')
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
    const root = shallow(<AppItem t={tMock} app={app} />)
    expect(root).toMatchSnapshot()
  })

  it('should render correctly with target mobile and providing fetchIcon to AppIcon', () => {
    global.__TARGET__ = 'mobile'
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppItem t={tMock} app={app} />)
    expect(root).toMatchSnapshot()
  })

  it('should change the onClick handler if native app is available', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppItem t={tMock} app={app} />)
    root.find('a').simulate('click')
    expect(openNativeSpy).not.toHaveBeenCalled()
    root.setState({ isMobileAppAvailable: true })
    root.find('a').simulate('click')
    expect(openNativeSpy).toHaveBeenCalled()
  })

  it('should change the onClick handler to use onAppSwitch if current app is mobile', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const appSwitchMock = jest.fn()
    const root = shallow(
      <AppItem t={tMock} app={app} onAppSwitch={appSwitchMock} />
    )
    root.find('a').simulate('click')
    expect(appSwitchMock).not.toHaveBeenCalled()
    root.setState({ isMobileAppAvailable: true })
    root.find('a').simulate('click')
    expect(appSwitchMock).toHaveBeenCalled()
  })

  it('should not change the onClick handler if current app is web and target app is web too', () => {
    const app = {
      slug: 'cozy-store',
      name: 'Store'
    }
    const appSwitchMock = jest.fn()
    const root = shallow(
      <AppItem t={tMock} app={app} onAppSwitch={appSwitchMock} />
    )
    root.find('a').simulate('click')
    expect(appSwitchMock).not.toHaveBeenCalled()
  })
})
