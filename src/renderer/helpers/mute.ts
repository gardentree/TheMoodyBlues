import {TweetType} from "../types/twitter";
import * as preferences from "./preferences";

const keywords = preferences.getMuteKeywords();

export default function mute(tweets: TweetType[]): TweetType[] {
  return tweets.filter((tweet) => {
    if (!keywords.every((keyword) => tweet.full_text.toLowerCase().indexOf(keyword) < 0)) return false;
    if (!keywords.every((keyword) => tweet.entities.urls.every((entity) => entity.display_url.indexOf(keyword) < 0))) return false;

    return true;
  });
}
