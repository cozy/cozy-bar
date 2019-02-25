/* global __TARGET__ */

import stack from 'lib/stack-client'

import internal from 'lib/stack-internal'

let oldTarget

describe("stack client", () => {

  describe("getAppIconProps", () => {

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
      oldTarget = global.__TARGET__
      jest.spyOn(internal.get, 'iconProps').mockResolvedValue(undefined)
      await stack.init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
      global.__TARGET__ = oldTarget
    })

    it("should not forward to the old internal client", () => {
      stack.get.iconProps()
      expect( internal.get.iconProps ).not.toHaveBeenCalled()
    })

    describe("for target=browser", () => {

      beforeAll(() => {
        global.__TARGET__ = "browser"
      })

      it("should have `domain` and `secure` set", () => {
        const data = stack.get.iconProps()
        expect( data.domain ).toBe("test.mycozy.cloud")
        expect( data.secure ).toBe(true)
      })

      it("should not have a `fetchIcon` function", () => {
        const data = stack.get.iconProps()
        expect( data.fetchIcon ).toBe(undefined)
      })

    })

    describe("for target=mobile", () => {

      beforeAll(() => {
        global.__TARGET__ = "mobile"
      })

      it("should note have `domain` and `secure` set", () => {
        const data = stack.get.iconProps()
        expect( data.domain ).toBeUndefined()
        expect( data.secure ).toBeUndefined()
      })

      it("should have a `fetchIcon` function set", () => {
        const data = stack.get.iconProps()
        expect( data.fetchIcon ).toBeInstanceOf(Function)
      })

    })

  })
  
})
