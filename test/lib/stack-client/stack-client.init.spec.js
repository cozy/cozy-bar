import stack from 'lib/stack-client'

import CozyClient from 'cozy-client'
import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime')

const { init } = stack

describe('stack client', () => {
  describe('init', () => {
    let cozyClient, params

    const setup = async ({ isLogged, isPublic }) => {
      if (isLogged === undefined) {
        throw new Error('Please define explicity isLogged in your tests.')
      }
      cozyClient = new CozyClient({
        token: { token: 'mytoken' },
        uri: 'https://test.mycozy.cloud'
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

    beforeEach(() => {
      isLogged = undefined
      isPublic = undefined
      initializeRealtime.mockReset().mockImplementation(() => {
        terminateRealtime = jest.fn()
        return terminateRealtime
      })
    })

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

    it('should terminate realtime if the user logs out', async  () => {
      isLogged = true
      await setup()
      expect(terminateRealtime).not.toHaveBeenCalled()
      cozyClient.emit('logout')
      expect(terminateRealtime).toHaveBeenCalled()
    })
  })
})
