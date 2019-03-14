import React from 'react'
import { Bar, mapStateToProps, mapDispatchToProps } from 'components/Bar'
import { shallow } from 'enzyme'
import { isMobileApp } from 'cozy-device-helper'
import toJson from 'enzyme-to-json'
import reducers from 'lib/reducers'

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

describe('Bar', () => {
  let props
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(Bar.prototype, 'fetchContent')
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

  afterEach(() => {
    Bar.prototype.fetchContent.mockRestore()
  })

  it('should fetch data when mounted', () => {
    shallow(<Bar {...props} />)
    expect(props.fetchContext).toHaveBeenCalled()
    expect(props.fetchApps).toHaveBeenCalled()
    expect(props.fetchSettingsData).toHaveBeenCalled()
    expect(Bar.prototype.fetchContent).toHaveBeenCalled()
  })

  it('should not fetch data if public', () => {
    shallow(<Bar {...props} isPublic={true} />)
    expect(props.fetchContext).not.toHaveBeenCalled()
    expect(props.fetchApps).not.toHaveBeenCalled()
    expect(props.fetchSettingsData).not.toHaveBeenCalled()
    expect(Bar.prototype.fetchContent).not.toHaveBeenCalled()
  })

  it('should not fetch apps if hasFetchedApps is true', () => {
    const barWrapper = shallow(<Bar {...props} hasFetchedApps={true} />)
    jest.resetAllMocks()
    barWrapper.setState({ drawerVisible: true }) // to call componentdidUpdate
    expect(props.fetchApps).not.toHaveBeenCalled()
    expect(Bar.prototype.fetchContent).not.toHaveBeenCalled()
  })

  it('should re-fetch apps if apps are not fetched and drawer opens', () => {
    const barWrapper = shallow(<Bar {...props} />)
    expect(Bar.prototype.fetchContent).toHaveBeenCalledTimes(1)
    expect(props.fetchApps).toHaveBeenCalledTimes(1)
    barWrapper.setState({ drawerVisible: true })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
    expect(Bar.prototype.fetchContent).toHaveBeenCalledTimes(2)
    barWrapper.setState({ drawerVisible: true, usageTracker: {} })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
    expect(Bar.prototype.fetchContent).toHaveBeenCalledTimes(2)
  })

  it('should change theme', () => {
    const barWrapper = shallow(<Bar {...props} theme="primary" />)
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should change allow theme overrides', () => {
    const barWrapper = shallow(
      <Bar
        {...props}
        theme="primary"
        themeOverrides={{ primaryColor: 'red' }}
      />
    )
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should display the Searchbar', () => {
    const barWrapper = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={false} />
    )
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should not display searchbar if we are on mobile', () => {
    isMobileApp.mockReturnValue(true)
    const barWrapper = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={false} />
    )
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should not display searchbar if we are not on Cozy Drive', () => {
    isMobileApp.mockReturnValue(true)
    const barWrapper = shallow(
      <Bar {...props} currentApp="Cozy Contacts" isPublic={false} />
    )
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should not display searchbar if we are not on  a public page', () => {
    isMobileApp.mockReturnValue(true)
    const barWrapper = shallow(
      <Bar {...props} currentApp="Cozy Drive" isPublic={true} />
    )
    expect(toJson(barWrapper)).toMatchSnapshot()
  })

  it('should have correct state props provided by the store with the initial state', () => {
    const initialState = reducers(undefined, {})
    expect(mapStateToProps(initialState)).toMatchSnapshot()
  })

  it('should have correct dispatch props provided by the store', () => {
    expect(mapDispatchToProps(jest.fn())).toMatchSnapshot()
  })
})
