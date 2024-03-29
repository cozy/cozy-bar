import React from 'react'
import { shallow } from 'enzyme'
import { ButtonCozyHome } from './ButtonCozyHome'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

jest.mock('cozy-device-helper')
jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn(() => ({ call: jest.fn() }))
}))

const homeHref = 'foo'
const expectedCall = 'backToHome'

describe('ButtonCozyHome', () => {
  it('should render a span with no props', () => {
    isFlagshipApp.mockImplementation(() => false)
    const render = shallow(<ButtonCozyHome />)
    const element = render.getElement()

    expect(element.type).toBe('span')
  })

  it('should render an anchor with correct href when homeHref', () => {
    isFlagshipApp.mockImplementation(() => false)
    const render = shallow(<ButtonCozyHome homeHref={homeHref} />)
    const element = render.getElement()

    expect(element.type).toBe('a')
    expect(element.props.href).toBe(homeHref)
  })

  it('should render an anchor when isFlagshipApp', () => {
    isFlagshipApp.mockImplementation(() => true)
    const render = shallow(<ButtonCozyHome />)
    const element = render.getElement()

    expect(element.type).toBe('a')
  })

  it('should give priority to anchor if both isFlagshipApp and homeHref are present', () => {
    isFlagshipApp.mockImplementation(() => true)
    const render = shallow(<ButtonCozyHome homeHref={homeHref} />)
    const element = render.getElement()

    expect(element.type).toBe('a')
  })

  it('should call the correct context method on click', () => {
    isFlagshipApp.mockImplementation(() => true)
    const mockCall = jest.fn()
    useWebviewIntent.mockImplementation(() => ({ call: mockCall }))
    const render = shallow(<ButtonCozyHome homeHref={homeHref} />)

    render.simulate('click')

    expect(mockCall).toBeCalledWith(expectedCall)
  })
})
