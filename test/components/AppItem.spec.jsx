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
    root.setState({ isAppAvailable: true })
    root.find('a').simulate('click')
    expect(openNativeSpy).toHaveBeenCalled()
  })
})
