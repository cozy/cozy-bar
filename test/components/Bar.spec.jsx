import React from 'react'
import { Bar } from 'components/Bar'
import { shallow } from 'enzyme'

describe('Bar', () => {

  let props
  beforeEach(() => {
    props = {
      fetchContext: jest.fn().mockResolvedValue({}),
      fetchApps: jest.fn().mockResolvedValue([]),
      fetchSettingsData: jest.fn().mockResolvedValue({}),
      t: x => x
    }
  })

  it('should fetch data when mounted', () => {
    const root = shallow(
      <Bar { ...props} />
    )
    expect(props.fetchContext).toHaveBeenCalled()
    expect(props.fetchApps).toHaveBeenCalled()
    expect(props.fetchSettingsData).toHaveBeenCalled()
  })

  it('should not fetch data if public', () => {
    const root = shallow(
      <Bar { ...props} isPublic={true } />
    )
    expect(props.fetchContext).not.toHaveBeenCalled()
    expect(props.fetchApps).not.toHaveBeenCalled()
    expect(props.fetchSettingsData).not.toHaveBeenCalled()
  })

  it('should not fetch apps if hasFetchedApps is true', () => {
    const root = shallow(
      <Bar { ...props} hasFetchedApps={true } />
    )
    expect(props.fetchApps).toHaveBeenCalled()
  })

  it('should re-fetch apps if apps are not fetched and drawer opens', () => {
    const root = shallow(
      <Bar { ...props} />
    )
    expect(props.fetchApps).toHaveBeenCalledTimes(1)
    root.setState({ drawerVisible: true })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
    root.setState({ drawerVisible: true, usageTracker: {} })
    expect(props.fetchApps).toHaveBeenCalledTimes(2)
  })
})
