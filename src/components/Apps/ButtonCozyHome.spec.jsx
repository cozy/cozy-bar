import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ButtonCozyHome } from './ButtonCozyHome'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

jest.mock('cozy-device-helper')
jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn(() => ({ call: jest.fn() }))
}))

describe('ButtonCozyHome', () => {
  it('renders a link with backToHome intent for flagship apps', () => {
    isFlagshipApp.mockReturnValue(true)

    const mockCall = jest.fn()
    useWebviewIntent.mockImplementation(() => ({ call: mockCall }))

    // We need to use a testid because
    // - the a tag has no text to query it (just an icon)
    // - an "a" tag without href is not seen as a link by queryByRole
    const { getByTestId } = render(<ButtonCozyHome />)
    const linkElement = getByTestId('buttonCozyHome')

    fireEvent.click(linkElement)

    expect(mockCall).toHaveBeenCalledWith('backToHome')
  })

  it('renders a link with homeHref for non-flagship apps with homeHref', () => {
    isFlagshipApp.mockReturnValue(false)

    const { queryByRole } = render(<ButtonCozyHome homeHref="/home" />)
    const linkElement = queryByRole('link')

    expect(linkElement).toHaveAttribute('href', '/home')
  })

  it('renders a span without href for non-flagship apps without homeHref', () => {
    isFlagshipApp.mockReturnValue(false)

    const { queryByRole } = render(<ButtonCozyHome />)
    const linkElement = queryByRole('link')

    expect(linkElement).toBeNull()
  })
})
