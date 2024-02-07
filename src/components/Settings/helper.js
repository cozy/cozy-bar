export const isFetchingQueries = requests =>
  requests.some(request => request.fetchStatus === 'loading')
