import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

describe("stack client", () => {

  describe("getApps", () => {

    const stackClient = {
      token: { token: "mytoken"},
      uri: "https://test.mycozy.cloud",
      fetch: jest.fn().mockResolvedValue(
        { 
          status: 200,
          headers: { get: (h) => "application/json" },
          json: () => {
            // example from https://docs.cozy.io/en/cozy-stack/apps/
            return { 
              "data": [{
                "id": "4cfbd8be-8968-11e6-9708-ef55b7c20863",
                "type": "io.cozy.apps",
                "meta": {
                  "rev": "2-bbfb0fc32dfcdb5333b28934f195b96a"
                },
                "attributes": {
                  "name": "calendar",
                  "state": "ready",
                  "slug": "calendar"
                },
                "links": {
                  "self": "/apps/calendar",
                  "icon": "/apps/calendar/icon",
                  "related": "https://calendar.alice.example.com/"
                }
              }]
            }
          }
        }
      )
    }
    
    const cozyClient = { 
      getStackClient: () => stackClient
    }

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {},
    }

    beforeAll( async () => {
      jest.spyOn(internal.get, 'apps').mockResolvedValue(undefined)
      await stack.init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should not forward to the old internal client", async () => {
      await stack.get.apps()
      expect( internal.get.apps ).not.toHaveBeenCalled()
    })

    it("should return the `data` content", async () => {
      const data = await stack.get.apps()
      expect( data[0].id ).toBe("4cfbd8be-8968-11e6-9708-ef55b7c20863")
    })

    it("should have called cozy-client", async () => {
      await stack.get.apps()
      expect( cozyClient.getStackClient().fetch ).toHaveBeenCalled()
    })

    it("should not throw", async () => {
      expect( () => stack.get.apps() ).not.toThrow()
      await expect( stack.get.apps() ).resolves.not.toBe(false)
    })

  })

})
