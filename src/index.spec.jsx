import React from 'react'
import { render, screen } from '@testing-library/react'

import { BarComponent, BarProvider, BarRight } from './index'
import { BarLike } from '../test/lib/BarLike'

describe('The bar library', function() {
  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML =
      '<div role="application" ' +
      'data-cozy="{&quot;app&quot;:{&quot;editor&quot;: &quot;Cozy&quot;,&quot;icon&quot;: &quot;public/app-icon.svg&quot;,&quot;name&quot;: &quot;Drive&quot;,&quot;prefix&quot;: &quot;Cozy&quot;,&quot;slug&quot;: &quot;drive&quot;}}">' +
      '  The application will be here' +
      '</div>'
  })

  it('should render correctly the cozy-bar', () => {
    render(
      <BarLike>
        <BarComponent />
      </BarLike>
    )

    const buttonElement = screen.queryByRole('button', { name: /settings/i })
    expect(buttonElement).toBeInTheDocument()
  })

  it('should render correctly the cozy-bar with customization', () => {
    render(
      <BarLike>
        <BarProvider>
          <BarComponent />
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
