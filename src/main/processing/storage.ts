import ElectronStore from "electron-store";
import {HOME, SEARCH, MENTIONS, GATEKEEPER} from "@shared/defaults";
import storage from "electron-json-storage";

const SCREENS: TMB.Backstage[] = [HOME, SEARCH, MENTIONS].map((template) => Object.assign({active: true}, template));

export function build(directory?: string) {
  const store = new ElectronStore({
    cwd: directory,
  });

  const getStore = (key: string) => {
    return store.get(key);
  };
  const setStore = (key: string, value: string | object) => {
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

    getBackstages: (): TMB.NormalizedBackstage => {
      return (getStore("backstages") as TMB.NormalizedBackstage) || SCREENS;
    },
    setBackstages: (screens: TMB.NormalizedBackstage) => {
      setStore("backstages", screens);
    },

    getGatekeeper: (): TMB.Gatekeeper => {
      return (getStore("gatekeeper") as TMB.Gatekeeper) || GATEKEEPER;
    },
    setGatekeeper: (preference: TMB.Gatekeeper) => {
      setStore("gatekeeper", preference);
    },

    getTweets: (identifier: TMB.ScreenID) => {
      return new Promise((resolve, reject) => {
        storage.get(`${identifier}.tweets`, (error: string, data: object) => {
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
    setTweets: (identifier: TMB.ScreenID, tweets: Twitter.Tweet[]) => {
      return new Promise<void>((resolve, reject) => {
        storage.set(`${identifier}.tweets`, tweets, (error: string) => {
          if (error) return reject(error);

          resolve();
        });
      });
    },
  };
}

export default build();
