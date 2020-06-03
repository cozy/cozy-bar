import CozyClient from 'cozy-client'
import stack from 'lib/stack-client'
import { isMobileApp } from 'cozy-device-helper'

import mockStackClient from '../mockStackClient'

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

describe('stack client', () => {
  describe('getAppIconProps', () => {
    const cozyClient = new CozyClient({
      stackClient: mockStackClient
    })

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {}
    }

    beforeAll(async () => {
      await stack.init(params)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    describe('for target=browser', () => {
      beforeAll(() => {
        isMobileApp.mockReturnValue(false)
      })
      it('should have `domain` and `secure` set', () => {
        const data = stack.get.iconProps()
        expect(data.domain).toBe('test.mycozy.cloud')
        expect(data.secure).toBe(true)
      })

      it('should not have a `fetchIcon` function', () => {
        const data = stack.get.iconProps()
        expect(data.fetchIcon).toBe(undefined)
      })
    })

    describe('for target=mobile', () => {
      beforeAll(() => {
        isMobileApp.mockReturnValue(true)
      })

      it('should not have `domain` and `secure` set', () => {
        const data = stack.get.iconProps()
        expect(data.domain).toBeUndefined()
        expect(data.secure).toBeUndefined()
      })

      it('should have a `fetchIcon` function set', () => {
        const data = stack.get.iconProps()
        expect(data.fetchIcon).toBeInstanceOf(Function)
      })
    })
  })
})
