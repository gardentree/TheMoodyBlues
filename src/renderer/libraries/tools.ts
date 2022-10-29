const {facade} = window;

export function showMenuForTweet(tweet: Twitter.Tweet) {
  return (event: React.SyntheticEvent<HTMLElement>) => {
    event.stopPropagation();

    const keyword = (window.getSelection() || "").toString().trim();

    facade.actions.openTweetMenu({tweet: tweet, keyword: keyword});
  };
}

export function extractOriginalFrom(tweet: Twitter.Tweet) {
  if (tweet.retweeted_status) {
    return tweet.retweeted_status;
  } else {
    return tweet;
  }
}
