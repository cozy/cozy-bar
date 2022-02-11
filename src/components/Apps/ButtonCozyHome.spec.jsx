import React from 'react'
import { shallow } from 'enzyme'

import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'

const homeHref = 'foo'
const expectedCall = 'backToHome'
const webviewContext = {
  call: jest.fn()
}

describe('ButtonCozyHome', () => {
  it('should render a span with no props', () => {
    const render = shallow(<ButtonCozyHome />)
    const element = render.getElement()

    expect(element.type).toBe('span')
  })

  it('should render an anchor with correct href when homeHref', () => {
    const render = shallow(<ButtonCozyHome homeHref={homeHref} />)
    const element = render.getElement()

    expect(element.type).toBe('a')
    expect(element.props.href).toBe(homeHref)
  })

  it('should render a button when webviewContext', () => {
    const render = shallow(<ButtonCozyHome webviewContext={webviewContext} />)
    const element = render.getElement()

    expect(element.type).toBe('button')
  })

  it('should give priority to button if both webviewContext and homeHref are present', () => {
    const render = shallow(
      <ButtonCozyHome homeHref={homeHref} webviewContext={webviewContext} />
    )
    const element = render.getElement()

    expect(element.type).toBe('button')
  })

  it('should call the correct context method on click', () => {
    const render = shallow(
      <ButtonCozyHome homeHref={homeHref} webviewContext={webviewContext} />
    )

    render.simulate('click')

    expect(webviewContext.call).toBeCalledWith(expectedCall)
  })
})
