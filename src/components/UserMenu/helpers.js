import { generateWebLink } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'

const getSettingsLink = ({ client, hash }) => {
  return generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'settings',
    hash,
    subDomainType: client.getInstanceOptions().subdomain
  })
}

export const openProfileLink = ({ client }) => {
  const link = getSettingsLink({ client, hash: 'profile' })
  window.open(link, '_self')
}

export const openStorageLink = ({ client }) => {
  const link = getSettingsLink({ client, hash: 'storage' })
  window.open(link, '_self')
}

export const logOut = async ({ client, webviewIntent, onLogOut }) => {
  if (onLogOut && typeof onLogOut === 'function') {
    const res = onLogOut()
    if (res instanceof Promise) {
      await res
    }
  } else {
    await client.logout()

    return isFlagshipApp() && webviewIntent
      ? webviewIntent.call('logout')
      : window.location.reload()
  }
}
