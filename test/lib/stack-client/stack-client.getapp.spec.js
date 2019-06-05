import CozyClient from 'cozy-client'
import stack from 'lib/stack-client'

describe('stack client', () => {
  describe('getApp', () => {
    const slug = 'testapp'

    const stackClient = {
      token: { token: 'mytoken' },
      uri: 'https://test.mycozy.cloud',
      fetch: jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => {
          // example from https://docs.cozy.io/en/cozy-stack/apps/
          return {
            data: {
              id: '4cfbd8be-8968-11e6-9708-ef55b7c20863',
              type: 'io.cozy.apps',
              meta: {
                rev: '2-bbfb0fc32dfcdb5333b28934f195b96a'
              },
              attributes: {
                name: 'calendar',
                state: 'ready',
                slug: 'calendar'
              },
              links: {
                self: '/apps/calendar',
                icon: '/apps/calendar/icon',
                related: 'https://calendar.alice.example.com/'
              }
            }
          }
        }
      })
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

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should return the `data` content', async () => {
      const data = await stack.get.app(slug)
      expect(data.id).toBe('4cfbd8be-8968-11e6-9708-ef55b7c20863')
    })

    it('should have called cozy-client', async () => {
      await stack.get.app(slug)
      expect(cozyClient.getStackClient().fetch).toHaveBeenCalled()
    })

    it('should not throw', async () => {
      expect(() => stack.get.app(slug)).not.toThrow()
      await expect(stack.get.app(slug)).resolves.not.toBe(false)
    })
  })
})
