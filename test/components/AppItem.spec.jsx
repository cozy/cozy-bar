import React from 'react'
import { AppItem } from 'components/Apps/AppItem'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { tMock } from '../jestLib/I18n'
import { isMobileApp, isMobile } from 'cozy-device-helper'

jest.useFakeTimers()
jest.mock('lib/stack', () => ({
  get: {
    iconProps: () => {
      return global.__TARGET__ === 'mobile'
        ? { fetchIcon: jest.fn().mockResolvedValue('http://urlOfIcon') }
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

const app = {
  slug: 'cozy-drive',
  name: 'Drive',
  href: 'http://fake.fr'
}

describe('AppItem', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('buildAppUrl', () => {
    it('should return untouched href', () => {
      const wrapper = shallow(<AppItem app={app} t={tMock} />)
      const url = wrapper.instance().buildAppUrl('http://fake.fr')
      expect(url).toBe('http://fake.fr/')
    })

    it('should update query string', () => {
      jest.spyOn(AppItem, 'buildQueryParams').mockReturnValue({
        foo: 'bar',
        bar: 'buz'
      })

      const wrapper = shallow(<AppItem app={app} t={tMock} />)
      const url = wrapper.instance().buildAppUrl('http://fake.fr')
      expect(url).toBe('http://fake.fr/?foo=bar&bar=buz')
    })
  })
})

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
    const root = mount(<AppItem t={tMock} app={app} />)
    expect(toJson(root)).toMatchSnapshot()
  })
})
