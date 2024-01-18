import React from 'react'
import { AppItem } from 'components/Apps/AppItem'

import { render, screen } from '@testing-library/react'
import { CozyProvider, createMockClient } from 'cozy-client'

jest.mock('lib/stack', () => ({
  get: {
    iconProps: () => {
      const { isMobileApp } = require('cozy-device-helper')
      return isMobileApp()
        ? {
            fetchIcon: jest.fn().mockResolvedValue('http://urlOfIcon')
          }
        : {
            // we mustn't give the protocol here
            domain: 'cozy.tools',
            secure: true
          }
    }
  }
}))

const defaultApp = {
  slug: 'cozy-drive',
  name: 'Drive',
  href: 'http://fake.fr'
}

describe('AppItem', () => {
  const setup = ({ app = defaultApp } = {}) => {
    const mockClient = createMockClient({})
    return render(
      <CozyProvider client={mockClient}>
        <AppItem app={app} />
      </CozyProvider>
    )
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render correctly', () => {
    setup()

    const linkElement = screen.getByRole('menuitem')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', 'http://fake.fr')
    expect(linkElement).toHaveAttribute('title', 'Drive')

    const labelElement = screen.getByText('Drive')
    expect(labelElement).toBeInTheDocument()
  })

  it('should have an empty href for invalid url', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const invalidApp = {
      name: 'Invalid app',
      url: 'Clearly not an url',
      slug: 'invalid-app'
    }

    setup({ app: invalidApp })

    const linkElement = screen.getByRole('menuitem')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', '')
  })
})
