export const MOUNT_COMPONENT = 'mount_component'
export const mountComponent = (screen: string) => ({
  type: MOUNT_COMPONENT,
  payload: {screen: screen},
  meta: null,
  error: false,
})

export const SEARCH_TWEETS = 'SEARCH_TWEETS'
export const searchTweets = (query: string) => ({
  type: SEARCH_TWEETS,
  payload: {query: query},
  meta: null,
  error: false,
})

