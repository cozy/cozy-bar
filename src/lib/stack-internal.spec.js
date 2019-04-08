import internal from 'lib/stack-internal'
import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime')
initializeRealtime.mockResolvedValue(Promise.resolve())

const { init } = internal

describe('stack internal', () => {
  describe('init', () => {
    let params = {
      cozyURL: 'test.mycozy.cloud',
      token: 'myToken',
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
      await init({ ...params, isPublic: true })
      expect(initializeRealtime).not.toHaveBeenCalled()
    })

    it('should called internal client and init realtime by default', async () => {
      await init({ ...params })
      expect(initializeRealtime).toHaveBeenCalled()
    })
  })
})
