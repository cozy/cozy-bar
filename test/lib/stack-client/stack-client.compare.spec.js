import { compareClientVersion } from 'lib/stack-client'

describe('stack client', () => {
  describe('compareClientVersion', () => {
    it('should compare to target versions', () => {
      const targetVersion = '6.7.8'
      const CozyClient = {
        version: '5.1.0'
      }

      expect(compareClientVersion(targetVersion, CozyClient)).toBe(false)

      CozyClient.version = targetVersion
      expect(compareClientVersion(targetVersion, CozyClient)).toBe(true)

      CozyClient.version = '10.7.8'
      expect(compareClientVersion(targetVersion, CozyClient)).toBe(true)
    })
  })
})
