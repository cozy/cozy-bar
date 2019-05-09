import internal from 'lib/stack-internal'
import { createFakeCozyClient } from 'lib/fakeCozyClient'
import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime')
initializeRealtime.mockResolvedValue(Promise.resolve())

const { init } = internal

const cozyURL = 'test.mycozy.cloud'
const token = 'myToken'

describe('stack internal', () => {
  describe('init', () => {
    let params = {
      cozyClient: createFakeCozyClient(cozyURL, token),
      onCreate: function() {},
      onDelete: function() {}
    }

    beforeAll(async () => {
      jest.spyOn(internal, 'init').mockResolvedValue(undefined)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not have initialized the realtime if public context', async () => {
      const fakeCozyClient = createFakeCozyClient(cozyURL, false)
      expect(fakeCozyClient.isLogged).toBe(false)
      await init({ ...params, cozyClient: fakeCozyClient })
      expect(initializeRealtime).not.toHaveBeenCalled()
    })

    it('should called internal client and init realtime by default', async () => {
      await init({ ...params })
      expect(initializeRealtime).toHaveBeenCalled()
    })
  })
})
