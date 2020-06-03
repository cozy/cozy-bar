import stack from 'lib/stack-client'
import CozyClient from 'cozy-client'
import mockStackClient from '../mockStackClient'

describe('stack client', () => {
  describe('cozyURL', () => {
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

    it('should give back the origin of cozy-client', () => {
      expect(stack.get.cozyURL()).toBe('https://test.mycozy.cloud')
    })
  })
})
