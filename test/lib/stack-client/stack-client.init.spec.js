import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'
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

    beforeAll(async () => {
      jest.spyOn(internal, 'init').mockResolvedValue(undefined)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not called internal client', async () => {
      await init(params)
      expect(internal.init).not.toHaveBeenCalled()
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
      await init({
        ...params,
        cozyClient: {
          ...cozyClient,
          isLogged: true
        }
      })
      expect(initializeRealtime).toHaveBeenCalled()
      expect(initializeRealtime.mock.calls[0][0].token).toBe('mytoken')
      expect(initializeRealtime.mock.calls[0][0].url).toBe(
        'https://test.mycozy.cloud'
      )
    })
  })
})
