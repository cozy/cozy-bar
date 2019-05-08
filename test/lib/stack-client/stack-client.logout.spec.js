import stack from 'lib/stack-client'
import CozyClient from 'cozy-client'

describe("stack client", () => {

  describe("logout", () => {

    const stackClient = {
      token: { token: "mytoken"},
      uri: "https://test.mycozy.cloud",
      fetch: jest.fn().mockResolvedValue({status: 200})
    }
    
    const cozyClient = new CozyClient({ 
      stackClient
    })

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {},
    }

    beforeAll(async () => {
      await stack.init(params)
      await stack.logout()
    })

    afterAll(() => {
      jest.restoreAllMocks()
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
