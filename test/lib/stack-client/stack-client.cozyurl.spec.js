import stack from 'lib/stack-client'

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
      await stack.init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should give back the origin of cozy-client", () => {
      expect( stack.get.cozyURL() ).toBe("https://test.mycozy.cloud")
    })

  })

})
