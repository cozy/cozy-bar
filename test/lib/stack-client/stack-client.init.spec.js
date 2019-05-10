import stack from 'lib/stack-client'

import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime')
initializeRealtime.mockResolvedValue(Promise.resolve())

const { init } = stack

describe('stack client', () => {
  describe('init', () => {
    let cozyClient = {
      getStackClient: () => {
        return {
          token: { token: 'mytoken' },
          uri: 'https://test.mycozy.cloud'
        }
      }
    }
    let params = {
      cozyClient,
      onCreate: function() {},
      onDelete: function() {}
    }

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not have initialized the realtime if the user is not logged', async () => {
      await init({
        ...params,
        cozyClient: {
          ...cozyClient,
          isLogged: false
        }
      })
      expect(initializeRealtime).toHaveBeenCalledTimes(0)
    })

    it('should not have initialized the realtime if the user is not logged even if isPublic is set to false', async () => {
      await init({
        ...params,
        isPublic: false,
        cozyClient: {
          ...cozyClient,
          isLogged: false
        }
      })
      expect(initializeRealtime).toHaveBeenCalledTimes(0)
    })

    it('should have initialized the realtime is the user is logged', async () => {
      const client = {
        ...cozyClient,
        isLogged: true
      }
      await init({
        ...params,
        cozyClient: client
      })
      expect(initializeRealtime).toHaveBeenCalled()
      expect(initializeRealtime.mock.calls[0][0].cozyClient).toBe(client)
    })
  })
})
