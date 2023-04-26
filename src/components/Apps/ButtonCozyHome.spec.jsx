import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { isFlagshipApp } from 'cozy-device-helper'

import { ButtonCozyHome } from './ButtonCozyHome'

jest.mock('cozy-device-helper')
jest.mock('cozy-ui/react/I18n', () => ({
  translate: () => Component => props => <Component t={() => {}} {...props} />
}))

const homeHref = 'foo'
const expectedCall = 'backToHome'
const webviewContext = {
  call: jest.fn()
}

describe('ButtonCozyHome', () => {
  it('should render a span with no props', () => {
    isFlagshipApp.mockImplementation(() => false)
    const { getByTestId } = render(<ButtonCozyHome />)
    const element = getByTestId('ButtonCozyHome-span')

    expect(element).toBeTruthy()
  })

  it('should render an anchor with correct href when homeHref', () => {
    isFlagshipApp.mockImplementation(() => false)
    const { getByTestId } = render(<ButtonCozyHome homeHref={homeHref} />)
    const element = getByTestId('ButtonCozyHome-homeHref')

    expect(element).toHaveProperty('href', `http://localhost/${homeHref}`)
    expect(element).toBeTruthy()
  })

  it('should render an anchor of flagship when webviewContext is present', () => {
    isFlagshipApp.mockImplementation(() => true)
    const { getByTestId } = render(
      <ButtonCozyHome webviewContext={webviewContext} />
    )
    const element = getByTestId('ButtonCozyHome-flagship')

    expect(element).toBeTruthy()
  })

  it('should give priority to anchor of flagship if both webviewContext and homeHref are present', () => {
    isFlagshipApp.mockImplementation(() => true)
    const { getByTestId } = render(
      <ButtonCozyHome homeHref={homeHref} webviewContext={webviewContext} />
    )
    const element = getByTestId('ButtonCozyHome-flagship')

    expect(element).toBeTruthy()
  })

  it('should call the correct context method on click', () => {
    isFlagshipApp.mockImplementation(() => true)
    const { getByTestId } = render(
      <ButtonCozyHome homeHref={homeHref} webviewContext={webviewContext} />
    )
    const element = getByTestId('ButtonCozyHome-flagship')

    fireEvent.click(element)

    expect(webviewContext.call).toBeCalledWith(expectedCall)
  })
})
