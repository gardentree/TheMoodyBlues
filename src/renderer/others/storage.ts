import * as twitter from "../others/twitter";

const storage = require("electron-json-storage");

export function getTweets() {
  return new Promise((resolve, reject) => {
    storage.get("tweets", (error: string, tweets: twitter.Tweet[]) => {
      if (error) return reject(error);
      if (!Array.isArray(tweets)) {
        tweets = [];
      }

      resolve(tweets);
    });
  });
}

export function setTweets(tweets: twitter.Tweet[]) {
  return new Promise((resolve, reject) => {
    storage.set("tweets", tweets, (error: string) => {
      if (error) return reject(error);

      resolve();
    });
  });
}
