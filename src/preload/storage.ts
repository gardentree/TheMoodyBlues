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

function getStore(key: string): any {
  return store.get(key);
}
function setStore(key: string, value: any) {
  store.set(key, value);
}

exports = {
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

  getTimelinePreferences: (): TheMoodyBlues.TimelinePreference[] => {
    return (
      (getStore("preferences.timelines") as TheMoodyBlues.TimelinePreference[]) || [
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
  setTimelinePreferences: (timelines: TheMoodyBlues.TimelinePreference[]) => {
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
  setTweets: (identity: string, tweets: TweetType[]) => {
    return new Promise<void>((resolve, reject) => {
      storage.set(`${identity}.tweets`, tweets, (error: string) => {
        if (error) return reject(error);

        resolve();
      });
    });
  },
};

export default exports;
