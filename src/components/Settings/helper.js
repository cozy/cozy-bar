import CozyClient from 'cozy-client'
import compare from 'semver-compare'

export const isFetchingQueries = requests => {
  return requests.some(request => request.fetchStatus === 'loading')
}

export const cozyClientCanCheckPremium = () => {
  if (!CozyClient.version) return false
  const result = compare(CozyClient.version, '8.3.0')
  return result >= 0
}
