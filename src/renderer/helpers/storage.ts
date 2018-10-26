import * as twitter from "../others/twitter";

const storage = require("electron-json-storage");

export function getTweets(name: string) {
  return new Promise((resolve, reject) => {
    storage.get(`${name}.tweets`, (error: string, tweets: twitter.Tweet[]) => {
      if (error) return reject(error);
      if (!Array.isArray(tweets)) {
        tweets = [];
      }

      resolve(tweets);
    });
  });
}

export function setTweets(name: string, tweets: twitter.Tweet[]) {
  return new Promise((resolve, reject) => {
    storage.set(`${name}.tweets`, tweets, (error: string) => {
      if (error) return reject(error);

      resolve();
    });
  });
}
