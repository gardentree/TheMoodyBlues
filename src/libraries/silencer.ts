export function silence(tweets: Twitter.Tweet[], preference: TheMoodyBlues.Store.MutePreference): Twitter.Tweet[] {
  const {keywords, selfRetweet} = preference;

  return tweets.filter((tweet) => {
    if (test(tweet, keywords)) {
      return false;
    }

    if (selfRetweet && tweet.retweeted_status) {
      if (tweet.user.id_str == tweet.retweeted_status.user.id_str) {
        return false;
      }
    }

    return true;
  });
}
export function test(tweet: Twitter.Tweet, keywords: string[]): string | null {
  for (const keyword of keywords) {
    if (tweet.full_text.toLowerCase().indexOf(keyword) >= 0) {
      return tweet.full_text;
    }
  }

  for (const keyword of keywords) {
    if (tweet.full_text.toLowerCase().indexOf(keyword) >= 0) {
      return tweet.full_text;
    }

    for (const url of tweet.entities.urls) {
      if (url.expanded_url.toLowerCase().indexOf(keyword) >= 0) {
        return url.expanded_url;
      }
    }
  }

  return null;
}
