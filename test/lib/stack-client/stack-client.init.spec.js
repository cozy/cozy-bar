import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

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
      onCreateApp: function() {},
      onDeleteApp: function() {},
    }

    beforeAll(async () => {
      jest.spyOn(internal, 'init').mockResolvedValue(undefined)
      await init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should called internal client", () => {
      expect( internal.init ).toHaveBeenCalled()
    })

    it("should have set the cozy-client token", () => {
      expect( internal.init.mock.calls[0][0].token ).toBe("mytoken")
    })

    it("should have set the cozy-client uri", () => {
      expect( internal.init.mock.calls[0][0].cozyURL ).toBe("https://test.mycozy.cloud")
    })

    it("should pass onCreateApp and onDeleteApp functions", () => {
      expect( internal.init.mock.calls[0][0].onDeleteApp ).toBeInstanceOf(Function)
      expect( internal.init.mock.calls[0][0].onCreateApp ).toBeInstanceOf(Function)
    })

  })

})
