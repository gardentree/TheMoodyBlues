import {EVERYONE} from "@shared/defaults";

const {facade} = window;

export function guard(tweets: Twitter.Tweet[], preference: TMB.GatekeeperPreference): Twitter.Tweet[] {
  return tweets.filter((tweet) => {
    for (const passenger of Object.values(preference.passengers)) {
      if (!check(tweet, passenger!)) {
        return false;
      }
    }

    return true;
  });
}
function check(tweet: Twitter.Tweet, passenger: TMB.PassengerPreference) {
  if ([EVERYONE, tweet.user.id_str, tweet.retweeted_status?.user.id_str].includes(passenger.identifier)) {
    const matched = test(
      tweet,
      Object.values(passenger.taboos).map((keyword) => keyword.keyword)
    );
    if (matched) {
      facade.logger.info(`silence: ${matched} of ${passenger.name}`);
      return false;
    }

    if (passenger.withMedia) {
      if ((tweet.entities.media?.length || 0) > 0) {
        facade.logger.info(`silence: media of ${passenger.name}`);
        return false;
      }
    }
  }

  if (passenger.retweetYourself) {
    if (tweet.user.id_str == tweet.retweeted_status?.user.id_str) {
      facade.logger.info(`silence: self retweet of ${passenger.name}`);
      return false;
    }
  }
  if (passenger.retweetReaction) {
    if (tweet.user.id_str == tweet.retweeted_status?.quoted_status?.user.id_str) {
      facade.logger.info(`silence: retweet reaction of ${passenger.name}`);
      return false;
    }
  }

  return true;
}

const MATCHER = new RegExp("^/(.+)/$");
export function test(tweet: Twitter.Tweet, keywords: string[]): string | null {
  const expressions = keywords.map((keyword) => {
    const matches = MATCHER.exec(keyword);
    if (matches) {
      return new RegExp(matches[1], "i");
    } else {
      return new RegExp(keyword, "i");
    }
  });

  if (tweet.retweeted_status) {
    tweet = tweet.retweeted_status;
  }

  for (const expression of expressions) {
    if (expression.test(tweet.full_text)) {
      return `${expression} in ${tweet.full_text}`;
    }
  }

  for (const expression of expressions) {
    for (const url of tweet.entities.urls) {
      if (expression.test(url.expanded_url)) {
        return `${expression} in ${url.expanded_url}`;
      }
    }
  }

  if (tweet.quoted_status) {
    return test(tweet.quoted_status, keywords);
  }

  return null;
}
