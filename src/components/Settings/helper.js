import { compareClientVersion } from 'lib/stack-client'
export const isFetchingQueries = requests => {
  console.log(requests)
  return requests.some(request => request.fetchStatus === 'loading')
}

export const cozyClientCanCheckPremium = () => {
  return false
  return compareClientVersion('8.3.0')
}
