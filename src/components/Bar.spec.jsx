import React from 'react'
import { isFlagshipApp, isMobileApp } from 'cozy-device-helper'
import { BarLike } from 'test/lib/BarLike'

import { Bar } from './Bar'
import { fireEvent, render, screen } from '@testing-library/react'
import CozyClient from 'cozy-client'

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn(),
  isFlagshipApp: jest.fn()
}))

describe('Bar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    isMobileApp.mockReturnValue(false)
  })

  afterEach(() => {
    isFlagshipApp.mockClear()
  })

  const mockFetchContext = jest.fn().mockResolvedValue({})
  const mockFetchApps = jest.fn().mockResolvedValue([])
  const mockFetchSettingsData = jest.fn().mockResolvedValue({})

  const setup = ({
    fetchContext = mockFetchContext,
    fetchApps = mockFetchApps,
    fetchSettingsData = mockFetchSettingsData,
    theme = 'default',
    themeOverrides = {},
    isPublic = false,
    hasFetchedApps = false,
    client
  } = {}) => {
    return render(
      <BarLike client={client}>
        <Bar
          fetchContext={fetchContext}
          fetchApps={fetchApps}
          fetchSettingsData={fetchSettingsData}
          theme={theme}
          themeOverrides={themeOverrides}
          isPublic={isPublic}
          hasFetchedApps={hasFetchedApps}
          onDrawer={jest.fn()}
        />
      </BarLike>
    )
  }

  it('should fetch data when mounted', () => {
    setup()

    expect(mockFetchContext).toHaveBeenCalled()
    expect(mockFetchApps).toHaveBeenCalled()
    expect(mockFetchSettingsData).toHaveBeenCalled()
  })

  it('should not fetch data if public', () => {
    setup({ isPublic: true })

    expect(mockFetchContext).not.toHaveBeenCalled()
    expect(mockFetchApps).not.toHaveBeenCalled()
    expect(mockFetchSettingsData).not.toHaveBeenCalled()
  })

  it('should not fetch apps if hasFetchedApps is true', async () => {
    setup({ hasFetchedApps: true })

    const toogleButton = await screen.getByText('Show menu drawer')
    fireEvent.click(toogleButton)

    // wait the drawer to be opened
    await screen.getByText('Contact us')

    expect(mockFetchApps).not.toHaveBeenCalled()
  })

  it('should re-fetch apps if apps are not fetched and drawer opens', async () => {
    setup({ hasFetchedApps: false })

    expect(mockFetchApps).toHaveBeenCalledTimes(1)

    const toogleButton = await screen.getByText('Show menu drawer')
    fireEvent.click(toogleButton)

    // wait the drawer to be opened
    await screen.getByText('Contact us')

    expect(mockFetchApps).toHaveBeenCalledTimes(2)
  })

  it('should change theme', () => {
    setup({ theme: 'primary' })

    const wrapper = screen.getByTestId('coz-bar-wrapper')

    expect(wrapper.className).toBe('coz-bar-wrapper coz-theme-primary')
  })

  it.skip('should change allow theme overrides', () => {
    setup({ theme: 'primary', themeOverrides: { primaryColor: 'red' } })

    const wrapper = screen.getByTestId('coz-bar-wrapper')

    // TODO : This not working because JSDom doesn't support CSS variables
    expect(wrapper).toHaveStyle('--cozBarThemePrimaryColor: red')
  })

  it('should call re-fetch data when token is refreshed', () => {
    const client = new CozyClient({})
    setup({ client: client })
    client.emit('tokenRefreshed')

    expect(mockFetchContext).toHaveBeenCalledTimes(2)
    expect(mockFetchApps).toHaveBeenCalledTimes(2)
    expect(mockFetchSettingsData).toHaveBeenCalledTimes(2)
  })
})
