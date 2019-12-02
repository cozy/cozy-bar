import compare from 'semver-compare'
import client from 'lib/stack-client'
export const isFetchingQueries = requests => {
  return requests.some(request => request.fetchStatus === 'loading')
}
/**
 *
 * @param {cozyClient} forcedCozyClient only used to test purpose
 *
 * We can not read `version` from `import CozyClient from cozy-client`
 * since in that case, we'll read version from the cozy-bar node modules
 * and not from the app one.
 *
 * In order to avoid this issue, we get the cozyclient instance from
 * lib/stack-client (cozyclient's instance passed by the app to the bar),
 * then read the constructor and then read the version from it
 */
export const cozyClientCanCheckPremium = (forcedCozyClient = null) => {
  const cozyClientToUse =
    forcedCozyClient !== null
      ? forcedCozyClient
      : client.getClient().constructor
  if (!cozyClientToUse.version) return false
  const result = compare(cozyClientToUse.version, '8.3.0')
  return result >= 0
}
