import CozyClient from 'cozy-client'
import compare from 'semver-compare'

export const isFetchingQueries = requests => {
  return requests.some(request => request.fetchStatus === 'loading')
}

export const cozyClientCanCheckPremium = (forcedCozyClient = null) => {
  const cozyClientToUse =
    forcedCozyClient !== null ? forcedCozyClient : CozyClient
  if (!cozyClientToUse.version) return false
  const result = compare(cozyClientToUse.version, '8.3.0')
  return result >= 0
}
