import { compareClientVersion } from 'lib/stack-client'
export const isFetchingQueries = requests => {
  return requests.some(request => request.fetchStatus === 'loading')
}

export const cozyClientCanCheckPremium = () => {
  return compareClientVersion('8.3.0')
}
