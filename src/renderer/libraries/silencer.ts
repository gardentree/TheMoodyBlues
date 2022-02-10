const {facade} = window;

export function silence(tweets: Twitter.Tweet[], preference: MutePreference): Twitter.Tweet[] {
  const {keywords, selfRetweet, media} = preference;

  return tweets.filter((tweet) => {
    if (test(tweet, keywords)) {
      facade.logger.info(`silence: ${tweet.full_text} of ${tweet.user.screen_name}`);
      return false;
    }

    if (selfRetweet && tweet.retweeted_status) {
      if (tweet.user.id_str == tweet.retweeted_status.user.id_str) {
        facade.logger.info(`silence: self retweet of ${tweet.user.screen_name}`);
        return false;
      }
    }

    if (media?.length > 0) {
      if (media.includes(tweet.user.screen_name) && tweet.entities.media && tweet.entities.media.length > 0) {
        facade.logger.info(`silence: media of ${tweet.user.screen_name}`);
        return false;
      }
    }

    return true;
  });
}
export function test(tweet: Twitter.Tweet, keywords: string[]): string | null {
  const loweredKeywords = keywords.map((keyword) => keyword.toLowerCase());

  if (tweet.retweeted_status) {
    tweet = tweet.retweeted_status;
  }

  for (const keyword of loweredKeywords) {
    if (tweet.full_text.toLowerCase().indexOf(keyword) >= 0) {
      return tweet.full_text;
    }
  }

  for (const keyword of loweredKeywords) {
    for (const url of tweet.entities.urls) {
      if (url.expanded_url.toLowerCase().indexOf(keyword) >= 0) {
        return url.expanded_url;
      }
    }
  }

  return null;
}
