import * as pathname from "path";
import ElectronStore from "electron-store";
import storage from "electron-json-storage";

const userDataDirectory = (() => {
  for (const key of process.argv) {
    const matchers = /--user-data-dir=(.+)/.exec(key);
    if (matchers) {
      return matchers[1];
    }
  }

  throw process.argv;
})();

const store = new ElectronStore({cwd: userDataDirectory});
storage.setDataPath(pathname.join(userDataDirectory, "storage"));

function getStore(key: string): string | string[] {
  return store.get(key) as string | string[];
}
function setStore(key: string, value: string | string[]) {
  store.set(key, value);
}

export function getAccessKey(): string {
  return getStore("access_token_key") as string;
}
export function setAccessKey(value: string) {
  setStore("access_token_key", value);
}

export function getAccessSecret(): string {
  return getStore("access_token_secret") as string;
}
export function setAccessSecret(value: string) {
  setStore("access_token_secret", value);
}

export function getMuteKeywords(): string[] {
  return (getStore("mute.keywords") as string[]) || [];
}
export function setMuteKeywords(keywords: string[]) {
  setStore("mute.keywords", keywords);
}

export function getTweets(name: string) {
  return new Promise((resolve, reject) => {
    storage.get(`${name}.tweets`, (error: string, data: object) => {
      if (error) return reject(error);

      let tweets: TweetType[];
      if (Array.isArray(data)) {
        tweets = data;
      } else {
        tweets = [];
      }

      resolve(tweets);
    });
  });
}
export function setTweets(name: string, tweets: TweetType[]) {
  return new Promise<void>((resolve, reject) => {
    storage.set(`${name}.tweets`, tweets, (error: string) => {
      if (error) return reject(error);

      resolve();
    });
  });
}
