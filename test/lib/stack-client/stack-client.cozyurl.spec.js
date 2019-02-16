import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

describe("stack client", () => {

  describe("cozyURL", () => {

    const stackClient = {
      token: { token: "mytoken"},
      uri: "https://test.mycozy.cloud",
    }
    
    const cozyClient = { 
      getStackClient: () => stackClient
    }

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {},
    }

    beforeAll(async () => {
      jest.spyOn(internal.get, 'cozyURL').mockResolvedValue(undefined)
      await stack.init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should give back the origin of cozy-client", () => {
      expect( stack.get.cozyURL() ).toBe("https://test.mycozy.cloud")
    })

    it("should not forward to the old internal client", () => {
      stack.get.cozyURL()
      expect( internal.get.cozyURL ).not.toHaveBeenCalled()
    })

  })

})
