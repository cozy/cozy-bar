import { generateWebLink } from 'cozy-client'

const isFetchingQueries = requests =>
  requests.some(request => request.fetchStatus === 'loading')

const getSettingsLink = ({ client, hash }) => {
  return generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'settings',
    hash,
    subDomainType: client.getInstanceOptions().subdomain
  })
}

export { isFetchingQueries, getSettingsLink }
