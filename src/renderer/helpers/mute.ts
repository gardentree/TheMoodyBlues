import * as storage from "./storage";

const keywords = storage.getMuteKeywords();

export default function mute(tweets: TweetType[]): TweetType[] {
  return tweets.filter((tweet) => {
    if (!keywords.every((keyword) => tweet.full_text.toLowerCase().indexOf(keyword) < 0)) return false;
    if (!keywords.every((keyword) => tweet.entities.urls.every((entity) => entity.display_url.toLowerCase().indexOf(keyword) < 0))) return false;

    return true;
  });
}
