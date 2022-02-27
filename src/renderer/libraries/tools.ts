const {facade} = window;

export function showMenuForTweet(tweet: Twitter.Tweet) {
  return (event: React.SyntheticEvent<HTMLElement>) => {
    event.stopPropagation();

    let target: Twitter.Tweet;
    if (tweet.retweeted_status) {
      target = tweet.retweeted_status;
    } else {
      target = tweet;
    }

    const keyword = (window.getSelection() || "").toString().trim();

    facade.actions.openTweetMenu({tweet: target, keyword: keyword});
  };
}