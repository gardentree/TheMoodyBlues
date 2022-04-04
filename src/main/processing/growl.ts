import growly from "growly";
import {decodeHTML} from "@shared/tools";

let running = true;

export function notify(tweets: Twitter.Tweet[]) {
  if (process.env.NODE_ENV === "test") return;
  if (tweets.length <= 0) return;

  for (const tweet of tweets.slice(0, 20)) {
    if (!running) return;

    growly.notify(
      decodeHTML(tweet.full_text),
      {
        title: tweet.user.screen_name,
        icon: tweet.user.profile_image_url_https,
      },
      (error, action) => {
        if (error) {
          running = false;
        }
      }
    );
  }
}
export function isRunning() {
  return running;
}
