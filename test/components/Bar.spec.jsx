import React from 'react'
import { Bar } from 'components/Bar'
import { shallow } from 'enzyme'
import { isMobileApp } from 'cozy-device-helper'
import toJson from 'enzyme-to-json'
jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

describe('Bar', () => {
  let props
  beforeEach(() => {
    isMobileApp.mockReturnValue(false)
    props = {
      fetchContext: jest.fn().mockResolvedValue({}),
      fetchApps: jest.fn().mockResolvedValue([]),
      fetchSettingsData: jest.fn().mockResolvedValue({}),
      theme: 'default',
      themeOverrides: {},
      t: x => x
    }
  })

  it('should fetch data when mounted', () => {
    const root = shallow(<Bar {...props} />)
    expect(props.fetchContext).toHaveBeenCalled()
    expect(props.fetchApps).toHaveBeenCalled()
    expect(props.fetchSettingsData).toHaveBeenCalled()
  })

  it('should not fetch data if public', () => {
    const root = shallow(<Bar {...props} isPublic={true} />)
    expect(props.fetchContext).not.toHaveBeenCalled()
    expect(props.fetchApps).not.toHaveBeenCalled()
    expect(props.fetchSettingsData).not.toHaveBeenCalled()
  })

  it('should not fetch apps if hasFetchedApps is true', () => {
    const root = shallow(<Bar {...props} hasFetchedApps={true} />)
    expect(props.fetchApps).toHaveBeenCalled()
  })

  it('should re-fetch apps if apps are not fetched and drawer opens', () => {
    const root = shallow(<Bar {...props} />)
    expect(props.fetchApps).toHaveBeenCalledTimes(1)
    root.setState({ drawerVisible: true })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
    root.setState({ drawerVisible: true, usageTracker: {} })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
  })

  it('should change theme', () => {
    const root = shallow(
      <Bar {...props} theme="primary" />
    )
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should change allow theme overrides', () => {
    const root = shallow(
      <Bar {...props} theme="primary" themeOverrides={{primaryColor: 'red'}} />
    )
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should display the Searchbar', () => {
    const root = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={false} />
    )
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should not display searchbar if we are on mobile', () => {
    isMobileApp.mockReturnValue(true)
    const root = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={false} />
    )
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should not display searchbar if we are not on Cozy Drive', () => {
    isMobileApp.mockReturnValue(true)
    const root = shallow(
      <Bar {...props} currentApp="Cozy Contacts" isPublic={false} />
    )
    expect(toJson(root)).toMatchSnapshot()
  })

  it('should not display searchbar if we are not on  a public page', () => {
    isMobileApp.mockReturnValue(true)
    const root = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={true} />
    )
    expect(toJson(root)).toMatchSnapshot()
  })
})
