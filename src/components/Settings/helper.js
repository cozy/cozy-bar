export const isFetching = requests => {
  return requests.some(request => request.fetchStatus === 'loading')
}
