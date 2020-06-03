import stack from 'lib/stack-client'

import CozyClient from 'cozy-client'
import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime')
initializeRealtime.mockResolvedValue(Promise.resolve())

const { init } = stack

describe('stack client', () => {
  describe('init', () => {
    let cozyClient, params

    const setup = async ({ isLogged, isPublic }) => {
      if (isLogged === undefined) {
        throw new Error('Please define explicity isLogged in your tests.')
      }
      const stackClient = {
        token: { token: 'mytoken' },
        uri: 'https://test.mycozy.cloud',
        on: () => {}
      }
      cozyClient = new CozyClient({
        token: { token: 'mytoken' },
        uri: 'https://test.mycozy.cloud',
        stackClient
      })
      cozyClient.isLogged = isLogged
      params = {
        cozyClient,
        isPublic,
        onCreate: function() {},
        onDelete: function() {}
      }
      await init(params)
    }

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not have initialized the realtime if the user is not logged', async () => {
      await setup({ isLogged: false })
      expect(initializeRealtime).toHaveBeenCalledTimes(0)
    })

    it('should not have initialized the realtime if the user is not logged even if isPublic is set to false', async () => {
      await setup({ isLogged: false, isPublic: false })
      expect(initializeRealtime).toHaveBeenCalledTimes(0)
    })

    it('should have initialized the realtime is the user is logged', async () => {
      await setup({ isLogged: true })
      expect(initializeRealtime).toHaveBeenCalled()
      expect(initializeRealtime.mock.calls[0][0].cozyClient).toBe(cozyClient)
    })
  })
})
