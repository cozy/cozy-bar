import React from 'react'
import { isFlagshipApp, isMobileApp } from 'cozy-device-helper'
import { BarLike } from 'test/lib/BarLike'

import { Bar } from './Bar'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMockClient } from 'cozy-client'

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
    isPublic = false,
    hasFetchedApps = false
  } = {}) => {
    const mockClient = createMockClient({
      clientOptions: {
        uri: 'http://cozy.localhost:8080'
      }
    })

    const result = render(
      <BarLike client={mockClient}>
        <Bar
          fetchContext={fetchContext}
          fetchApps={fetchApps}
          fetchSettingsData={fetchSettingsData}
          isPublic={isPublic}
          hasFetchedApps={hasFetchedApps}
          onDrawer={jest.fn()}
        />
      </BarLike>
    )

    return {
      ...result,
      client: mockClient
    }
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

  it('should call re-fetch data when token is refreshed', () => {
    const { client } = setup()
    client.emit('tokenRefreshed')

    expect(mockFetchContext).toHaveBeenCalledTimes(2)
    expect(mockFetchApps).toHaveBeenCalledTimes(2)
    expect(mockFetchSettingsData).toHaveBeenCalledTimes(2)
  })
})
