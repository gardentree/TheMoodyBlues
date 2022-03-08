const {facade} = window;

export function silence(tweets: Twitter.Tweet[], preference: TMB.MutePreference): Twitter.Tweet[] {
  const {keywords, selfRetweet, media, retweetReaction} = preference;

  return tweets.filter((tweet) => {
    const matched = test(tweet, keywords);
    if (matched) {
      facade.logger.info(`silence: ${matched} of ${tweet.user.screen_name}`);
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

    if (retweetReaction?.length > 0 && tweet.retweeted_status?.quoted_status) {
      if (retweetReaction.includes(tweet.user.id_str) && tweet.user.id_str == tweet.retweeted_status.quoted_status.user.id_str) {
        facade.logger.info(`silence: retweet reaction of ${tweet.user.screen_name}`);
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

  if (tweet.quoted_status) {
    return test(tweet.quoted_status, keywords);
  }

  return null;
}
