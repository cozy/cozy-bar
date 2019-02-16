import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

describe("stack client", () => {

  describe("getStorageData", () => {

    const r200 = { 
      status: 200,
      headers: { get: (h) => "application/json" },
      json: () => {
        return {
          "data": {
            "type": "io.cozy.settings",
            "id": "io.cozy.settings.disk-usage",
            "attributes": {
              "is_limited": true,
              "quota": "123456789",
              "used": "12345678"
            }
          }
        }
      }
    }

    const r200noquota = { 
      status: 200,
      headers: { get: (h) => "application/json" },
      json: () => {
        return {
          "data": {
            "type": "io.cozy.settings",
            "id": "io.cozy.settings.disk-usage",
            "attributes": {
              "is_limited": false,
              "used": "2000111222333" // 2To
            }
          }
        }
      }
    }

    const stackClient = {
      token: { token: "mytoken"},
      uri: "https://test.mycozy.cloud",
      fetch: jest.fn()
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
      jest.spyOn(internal.get, 'storageData').mockResolvedValue(undefined)
      await stack.init(params)
    })

    beforeEach( () => {
      stackClient.fetch.mockClear()
      stackClient.fetch.mockResolvedValue(r200)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it("should not forward to the old internal client", async () => {
      await stack.get.storageData()
      expect( internal.get.storageData ).not.toHaveBeenCalled()
    })

    it("should return a decidated object", async () => {
      const data = await stack.get.storageData()
      expect( data.usage ).toBe(12345678)
      expect( data.quota ).toBe(123456789)
      expect( data.isLimited ).toBe(true)
    })

    it("when no quota is provided, one should be given", async () => {
      stackClient.fetch.mockResolvedValue(r200noquota)
      const data = await stack.get.storageData()
      expect( data.usage ).toBe(2000111222333)
      expect( data.quota ).toBeGreaterThanOrEqual(data.usage)
      expect( data.isLimited ).toBe(false)
    })

  })

})
