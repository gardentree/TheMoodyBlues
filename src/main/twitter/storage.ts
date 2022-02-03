import ElectronStore from "electron-store";

const storage = require("electron-json-storage");

const store = new ElectronStore();

const getStore = (key: string) => {
  return store.get(key);
};
const setStore = (key: string, value: any) => {
  store.set(key, value);
};

export default {
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
    return getStore("preferences.timelines") as TheMoodyBlues.Store.TimelinePreference[];
  },
  setTimelinePreferences: (timelines: TheMoodyBlues.Store.TimelinePreference[]) => {
    setStore("preferences.timelines", timelines);
  },

  getMutePreference: (): TheMoodyBlues.Store.MutePreference => {
    return getStore("preferences.mute") as TheMoodyBlues.Store.MutePreference;
  },
  setMutePreference: (preference: TheMoodyBlues.Store.MutePreference) => {
    setStore("preferences.mute", preference);
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
