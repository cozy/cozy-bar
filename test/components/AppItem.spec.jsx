import React from 'react'
import { AppItem } from 'components/Apps/AppItem'
import { shallow } from 'enzyme'
import { tMock } from '../jestLib/I18n'
import {
  isMobileApp,
  isMobile,
  openDeeplinkOrRedirect
} from 'cozy-device-helper'

jest.useFakeTimers()
jest.mock('lib/stack', () => ({
  get: {
    iconProps: () => {
      return global.__TARGET__ === 'mobile'
        ? { fetchIcon: jest.fn }
        : {
            // we mustn't give the protocol here
            domain: 'cozy.tools',
            secure: true
          }
    }
  }
}))

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn(),
  isMobile: jest.fn(),
  openDeeplinkOrRedirect: jest.fn()
}))
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
    isMobileApp.mockReturnValue(false)
    isMobile.mockReturnValue(false)
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
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should render correctly with target mobile and providing fetchIcon to AppIcon', () => {
    global.__TARGET__ = 'mobile'
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppItem t={tMock} app={app} />)
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should change the onClick handler if native app is available', () => {
    isMobileApp.mockReturnValue(true)
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppItem t={tMock} app={app} />)
    root.find('a').simulate('click')
    jest.runAllTimers()
    expect(openNativeSpy).not.toHaveBeenCalled()
    root.setState({ isMobileAppAvailable: true })
    root.find('a').simulate('click')
    jest.runAllTimers()
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
    jest.runAllTimers()
    expect(appSwitchMock).not.toHaveBeenCalled()
    isMobileApp.mockReturnValue(true)
    root.setState({ isMobileAppAvailable: true })
    root.find('a').simulate('click')
    jest.runAllTimers()
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
    jest.runAllTimers()
    expect(appSwitchMock).not.toHaveBeenCalled()
  })

  it('should call deeplink if the currentApp is web mobile and the other app is native', () => {
    isMobile.mockReturnValue(true)
    const app = {
      slug: 'drive',
      name: 'Drive'
    }
    const appSwitchMock = jest.fn()
    const root = shallow(
      <AppItem t={tMock} app={app} onAppSwitch={appSwitchMock} />
    )
    root.find('a').simulate('click', { preventDefault: () => {} })
    jest.runAllTimers()
    expect(openDeeplinkOrRedirect).toHaveBeenCalled()
  })
})
