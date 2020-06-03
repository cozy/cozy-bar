import CozyClient from 'cozy-client'
import cozyBar from './index'

describe('init', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error')
    const div = document.createElement('div')
    div.setAttribute('role', 'application')
    document.body.appendChild(div)
  })

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error.mockRestore()
  })

  it('should init the bar', () => {
    const client = new CozyClient({})
    cozyBar.init({
      appName: 'App',
      cozyClient: client,
      lang: 'fr'
    })
    cozyBar.setBarCenter('Page title')
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled()
  })
})
