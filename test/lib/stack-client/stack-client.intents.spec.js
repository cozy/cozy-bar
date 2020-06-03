import { Intents } from 'cozy-interapp'
import stack from 'lib/stack-client'
import CozyClient from 'cozy-client'

describe('stack client', () => {
  describe('intents', () => {
    const stackClient = {
      token: { token: 'mytoken' },
      uri: 'https://test.mycozy.cloud',
      on: () => {}
    }

    const cozyClient = new CozyClient({
      stackClient
    })

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {}
    }

    beforeAll(async () => {
      await stack.init(params)
    })

    it('should return correctly the Intents instance', () => {
      const intents = stack.get.intents()
      expect(intents).toBeInstanceOf(Intents)
    })
  })
})
