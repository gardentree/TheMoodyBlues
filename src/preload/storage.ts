import * as pathname from "path";
import ElectronStore from "electron-store";

export function buildStorage(userDataDirectory: string) {
  const storage = require("electron-json-storage");

  const store = new ElectronStore({cwd: userDataDirectory});
  storage.setDataPath(pathname.join(userDataDirectory, "storage"));

  const getStore = (key: string) => {
    return store.get(key);
  };
  const setStore = (key: string, value: any) => {
    store.set(key, value);
  };

  return {
    getAccessKey: (): string => {
      return getStore("access_token.key") as string;
    },
    setAccessKey: (value: string) => {
      setStore("access_token.key", value);
    },

    getAccessSecret: (): string => {
      return getStore("access_token.secret") as string;
    },
    setAccessSecret: (value: string) => {
      setStore("access_token.secret", value);
    },

    getTimelinePreferences: (): TheMoodyBlues.Store.TimelinePreference[] => {
      return (
        (getStore("preferences.timelines") as TheMoodyBlues.Store.TimelinePreference[]) || [
          {
            identity: "home",
            title: "Home",
            component: "Timeline",
            interval: 120,
            way: "retrieveTimeline",
          },
          {
            identity: "search",
            title: "Search",
            component: "Search",
            interval: 60,
            way: "search",
          },
          {
            identity: "mentions",
            title: "Mentions",
            component: "Timeline",
            interval: 300,
            way: "retrieveMentions",
          },
        ]
      );
    },
    setTimelinePreferences: (timelines: TheMoodyBlues.Store.TimelinePreference[]) => {
      setStore("preferences.timelines", timelines);
    },

    getMuteKeywords: (): string[] => {
      return (getStore("preferences.mute.keywords") as string[]) || [];
    },
    setMuteKeywords: (keywords: string[]) => {
      setStore("preferences.mute.keywords", keywords);
    },

    getTweets: (identity: string) => {
      return new Promise((resolve, reject) => {
        storage.get(`${identity}.tweets`, (error: string, data: object) => {
          if (error) return reject(error);

          let tweets: Twitter.Tweet[];
          if (Array.isArray(data)) {
            tweets = data;
          } else {
            tweets = [];
          }

          resolve(tweets);
        });
      });
    },
    setTweets: (identity: string, tweets: Twitter.Tweet[]) => {
      return new Promise<void>((resolve, reject) => {
        storage.set(`${identity}.tweets`, tweets, (error: string) => {
          if (error) return reject(error);

          resolve();
        });
      });
    },
  };
}
let defaultStorage: any = null;
export function buildDefaultStorage() {
  if (defaultStorage) {
    return defaultStorage;
  }

  const userDataDirectory = (() => {
    for (const key of process.argv) {
      const matchers = /--user-data-dir=(.+)/.exec(key);
      if (matchers) {
        return matchers[1];
      }
    }

    throw new Error(`There's no --user-data-dir in [${process.argv.toString()}]`);
  })();

  defaultStorage = buildStorage(userDataDirectory);
  return defaultStorage;
}
