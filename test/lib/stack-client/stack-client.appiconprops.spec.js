import CozyClient from 'cozy-client'
import stack from 'lib/stack-client'

import mockStackClient from '../mockStackClient'

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

    it('should have `domain` and `secure` set', () => {
      const data = stack.get.iconProps()
      expect(data.domain).toBe('test.mycozy.cloud')
      expect(data.secure).toBe(true)
    })
  })
})
