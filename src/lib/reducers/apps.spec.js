import CozyClient from 'cozy-client'
import client from 'lib/stack-client.js'
import stack from 'lib/stack.js'
import { setDefaultApp } from './apps'

const cozyURL = 'https://test.mycozy.cloud'
const token = 'mytoken'
const fakeStackClient = {
  uri: cozyURL,
  token: { token }
}
describe('app reducer', () => {
  beforeAll(() => {
    jest.clearAllMocks()
    const params = {
      cozyClient: new CozyClient({ fakeStackClient }),
      onCreate: function() {},
      onDelete: function() {}
    }

    stack.init(params)
  })
  it('dispatch RECEIVE_HOME_APP if context has default redirection', async () => {
    jest.spyOn(client.get, 'context').mockResolvedValue({
      data: { attributes: { default_redirection: 'home/' } }
    })
    const dispatchMock = jest.fn(x => x)

    const setted = setDefaultApp([{ slug: 'home' }])
    await setted(dispatchMock)
    expect(dispatchMock).toHaveBeenCalledWith({
      homeApp: { slug: 'home' },
      type: 'RECEIVE_HOME_APP'
    })
  })

  it('dispatch RECEIVE_HOME_APP with hardcoded home if context has no default redirection', async () => {
    jest.spyOn(client.get, 'context').mockResolvedValue({})
    const dispatchMock = jest.fn(x => x)

    const setted = setDefaultApp([{ slug: 'home' }])
    await setted(dispatchMock)
    expect(dispatchMock).toHaveBeenCalledWith({
      homeApp: { slug: 'home' },
      type: 'RECEIVE_HOME_APP'
    })
  })
})
