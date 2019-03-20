import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'
import initializeRealtime from 'lib/realtime'

jest.mock('lib/realtime');
initializeRealtime.mockResolvedValue(Promise.resolve())

const {
  init,
} = stack


describe("stack client", () => {

  describe("init", () => {
    let cozyClient = {
      getStackClient: () => {
        return {
          token: { token: "mytoken"},
          uri: "https://test.mycozy.cloud"
        }
      }
    }
    let params = {
      cozyClient,
      onCreate: function() {},
      onDelete: function() {},
    }

    beforeAll(async () => {
      jest.spyOn(internal, 'init').mockResolvedValue(undefined)
      await init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should not called internal client", () => {
      expect( internal.init ).not.toHaveBeenCalled()
    })

    it("should have initialized the realtime", () => {
      expect( initializeRealtime ).toHaveBeenCalled()
      expect( initializeRealtime.mock.calls[0][0].token ).toBe("mytoken")
      expect( initializeRealtime.mock.calls[0][0].url ).toBe("https://test.mycozy.cloud")
    })
  })

})
