import growly from "growly";
import {decodeHTML} from "@shared/tools";

export default function growl(tweets: Twitter.Tweet[]) {
  if (process.env.NODE_ENV === "test") return;
  if (tweets.length <= 0) return;

  for (let tweet of tweets.slice(0, 20)) {
    growly.notify(decodeHTML(tweet.full_text), {
      title: tweet.user.screen_name,
      icon: tweet.user.profile_image_url_https,
    });
  }
}
