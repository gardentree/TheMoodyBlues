import {contextBridge, ipcRenderer, shell} from "electron";
import storage from "./storage";
import {authorize, call} from "./twitter_agent";
import growl from "./growly";
import logger from "electron-log";
import keybinds from "./keybinds";

const openExternal = (url: string) => {
  shell.openExternal(url);
};

const openTweetMenu = (context: TweetMenuType) => {
  ipcRenderer.send("openTweetMenu", context);
};

contextBridge.exposeInMainWorld("TheMoodyBlues", {
  agent: {
    authorize: authorize,
    call: call,
  },
  storage: storage,
  keybinds: keybinds,
  growl: growl,
  openTweetMenu: openTweetMenu,
  openExternal: openExternal,
  logger: logger,
});
