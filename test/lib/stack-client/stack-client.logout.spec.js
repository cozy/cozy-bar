import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

describe("stack client", () => {

  describe("logout", () => {

    const stackClient = {
      token: { token: "mytoken"},
      uri: "https://test.mycozy.cloud",
      fetch: jest.fn().mockResolvedValue({status: 200})
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
      jest.spyOn(internal, 'logout').mockResolvedValue(undefined)
      await stack.init(params)
      await stack.logout()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should not forward to the old internal client", () => {
      expect( internal.logout ).not.toHaveBeenCalled()
    })

    it("should have called cozy-client", () => {
      expect( cozyClient.getStackClient().fetch ).toHaveBeenCalled()
    })

    it("should not throw", async () => {
      expect( () => stack.logout() ).not.toThrow()
      await expect( stack.logout() ).resolves.not.toBe(false)
    })

  })

})
