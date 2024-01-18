import React from 'react'
import { render, screen } from '@testing-library/react'

import { BarComponent, BarProvider, BarRight } from './index'
import { BarLike } from '../test/lib/BarLike'

describe('The bar library', function() {
  it('should render correctly the cozy-bar', () => {
    // Set up our document body
    document.body.innerHTML =
      '<div role="application">' + '  The application will be here' + '</div>'
    const options = {
      appName: 'Mock',
      appNamePrefix: 'Cozy',
      iconPath: '',
      cozyURL: 'https://mock.cozy',
      token: 'mock'
    }

    render(
      <BarLike>
        <BarComponent {...options} />
      </BarLike>
    )
  })

  it('should render correctly the cozy-bar with customization', () => {
    document.body.innerHTML =
      '<div role="application">' + '  The application will be here' + '</div>'
    const options = {
      appName: 'test-app',
      appNamePrefix: 'cozy',
      iconPath: '',
      cozyURL: 'https://mock.cozy',
      token: 'mock'
    }

    render(
      <BarLike>
        <BarProvider>
          <BarComponent {...options} />
          <BarRight>Custom text</BarRight>
        </BarProvider>
      </BarLike>
    )

    const buttonElement = screen.queryByRole('button', { name: /settings/i })
    expect(buttonElement).not.toBeInTheDocument()

    const currentApp = screen.getByText('Custom text')
    expect(currentApp).toBeInTheDocument()
  })
})
