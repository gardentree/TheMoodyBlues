const {facade} = window;

export function silence(tweets: Twitter.Tweet[], preference: TMB.MutePreference): Twitter.Tweet[] {
  const {keywords, selfRetweet, withMedia, retweetReaction} = preference;

  return tweets.filter((tweet) => {
    const {id_str, screen_name} = tweet.user;

    const matched = test(tweet, keywords);
    if (matched) {
      facade.logger.info(`silence: ${matched} of ${screen_name}`);
      return false;
    }

    if (selfRetweet && tweet.retweeted_status?.user.id_str == id_str) {
      facade.logger.info(`silence: self retweet of ${screen_name}`);
      return false;
    }

    if (withMedia?.includes(id_str) && (tweet.entities.media?.length || 0) > 0) {
      facade.logger.info(`silence: media of ${screen_name}`);
      return false;
    }

    if (retweetReaction?.includes(id_str) && tweet.retweeted_status?.quoted_status?.user.id_str == id_str) {
      facade.logger.info(`silence: retweet reaction of ${screen_name}`);
      return false;
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

  if (tweet.quoted_status) {
    return test(tweet.quoted_status, keywords);
  }

  return null;
}
