import React from 'react'
import { render, screen } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { AppsContent } from 'components/Apps/AppsContent'
import { BarLike } from '../lib/BarLike'
import stack from 'lib/stack'

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/providers/Breakpoints'),
  __esModule: true,
  default: jest.fn()
}))

jest.mock('components/Apps/AppItemPlaceholder', () => {
  function AppItemPlaceholder() {
    return <div>AppItemPlaceholder</div>
  }
  AppItemPlaceholder.displayName = 'AppItemPlaceholder'
  return AppItemPlaceholder
})

describe('Apps Content', () => {
  const setup = ({
    isFetchingApps = false,
    isMobile = false,
    apps,
    homeApp
  } = {}) => {
    useBreakpoints.mockReturnValue({ isMobile })

    const mockClient = createMockClient({
      clientOptions: {
        uri: 'http://cozy.tools:8080'
      }
    })

    stack.init({
      cozyClient: mockClient
    })

    return render(
      <BarLike client={mockClient}>
        <AppsContent
          isFetchingApps={isFetchingApps}
          apps={apps}
          homeApp={homeApp}
        />
      </BarLike>
    )
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render no App', () => {
    setup({ isMobile: true })
    expect(
      screen.getByText('No applications found on the Cozy.')
    ).toBeInTheDocument()
  })

  it('should render display Drive', () => {
    const apps = [
      {
        slug: 'cozy-drive',
        name: 'Drive'
      }
    ]
    setup({ apps, isMobile: true })
    expect(screen.getByText('Drive')).toBeInTheDocument()
  })

  it('should render Loader when fetching', () => {
    const apps = [
      {
        slug: 'cozy-drive',
        name: 'Drive'
      }
    ]
    setup({ apps, isMobile: true, isFetchingApps: true })
    expect(screen.getAllByText('AppItemPlaceholder')).toHaveLength(3)
  })

  it('should display home in the app items lists, if we are on mobile', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]

    setup({ apps, isMobile: true })

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should not display home within the app items list, but just a link', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]

    setup({
      apps,
      homeApp: {
        slug: 'cozy-home'
      }
    })

    expect(screen.queryByText('Home')).toBeNull()
  })

  it('should not display home if not on mobile and home is the currentApp', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]

    setup({
      apps,
      homeApp: {
        slug: 'cozy-home',
        isCurrentApp: true
      }
    })

    expect(screen.queryByText('Home')).toBeNull()
  })
})
