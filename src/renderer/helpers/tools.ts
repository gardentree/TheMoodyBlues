const {TheMoodyBlues} = window;
export function openContextMenu(tweet: Twitter.Tweet) {
  return (event: React.SyntheticEvent<HTMLElement>) => {
    event.stopPropagation();

    let target: Twitter.Tweet;
    if (tweet.retweeted_status) {
      target = tweet.retweeted_status;
    } else {
      target = tweet;
    }

    const keyword = (window.getSelection() || "").toString().trim();

    TheMoodyBlues.openTweetMenu({tweet: target, keyword: keyword});
  };
}
