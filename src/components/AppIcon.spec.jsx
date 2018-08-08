import React from 'react'
import { AppIcon } from './AppIcon'
import { shallow } from 'enzyme'

describe('app icon', () => {
  let spyConsoleError
  beforeEach(() => {
    spyConsoleError = jest.spyOn(console, 'error')
    spyConsoleError.mockImplementation(message => {
      if (message.lastIndexOf('Warning: Failed prop type:') === 0) {
        throw new Error(message)
      }
    })
  })

  afterEach(() => {
    spyConsoleError.mockRestore()
  })

  it('should render correctly', () => {
    const app = {
      slug: 'cozy-drive',
      name: 'Drive'
    }
    const root = shallow(<AppIcon app={app} />)
    expect(root).toMatchSnapshot()
  })
})
