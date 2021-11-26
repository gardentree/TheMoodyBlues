import * as storage from "./storage";

const keywords = storage.getMuteKeywords();

export default function mute(tweets: Twitter.Tweet[]): Twitter.Tweet[] {
  return tweets.filter((tweet) => {
    if (!keywords.every((keyword) => tweet.full_text.toLowerCase().indexOf(keyword) < 0)) return false;
    if (!keywords.every((keyword) => tweet.entities.urls.every((entity) => entity.display_url.toLowerCase().indexOf(keyword) < 0))) return false;

    if (tweet.retweeted_status) {
      if (tweet.user.id_str == tweet.retweeted_status.user.id_str) {
        return false;
      }
    }

    return true;
  });
}
