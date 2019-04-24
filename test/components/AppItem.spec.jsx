import React from 'react'
import { AppItem } from 'components/Apps/AppItem'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { tMock } from '../jestLib/I18n'
import { isMobileApp, isMobile } from 'cozy-device-helper'

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
  let spyConsoleError

  beforeEach(() => {
    global.__TARGET__ = 'browser'
    spyConsoleError = jest.spyOn(console, 'error')

    isMobileApp.mockReturnValue(false)
    isMobile.mockReturnValue(false)
  })

  afterEach(() => {
    spyConsoleError.mockRestore()
    //openNativeSpy.mockRestore()
  })

  it('should render correctly', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive',
      href: 'http://fake.fr'
    }
    const root = mount(<AppItem t={tMock} app={app} />)
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should render correctly with target mobile and providing fetchIcon to AppIcon', () => {
    global.__TARGET__ = 'mobile'
    const app = {
      slug: 'cozy-drive',
      name: 'Drive',
      href: 'http://fake.fr'
    }
    const root = mount(<AppItem t={tMock} app={app} />)
    expect(toJson(root)).toMatchSnapshot()
  })
})
