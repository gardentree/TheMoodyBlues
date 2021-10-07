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

exports = {
  getAccessKey: (): string => {
    return getStore("access_token_key") as string;
  },
  setAccessKey: (value: string) => {
    setStore("access_token_key", value);
  },

  getAccessSecret: (): string => {
    return getStore("access_token_secret") as string;
  },
  setAccessSecret: (value: string) => {
    setStore("access_token_secret", value);
  },

  getMuteKeywords: (): string[] => {
    return (getStore("mute.keywords") as string[]) || [];
  },
  setMuteKeywords: (keywords: string[]) => {
    setStore("mute.keywords", keywords);
  },

  getTweets: (name: string) => {
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
  },
  setTweets: (name: string, tweets: TweetType[]) => {
    return new Promise<void>((resolve, reject) => {
      storage.set(`${name}.tweets`, tweets, (error: string) => {
        if (error) return reject(error);

        resolve();
      });
    });
  },
};

export default exports;
