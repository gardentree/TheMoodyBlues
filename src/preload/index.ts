import {contextBridge, ipcRenderer, shell, clipboard} from "electron";
import {buildDefaultStorage} from "./storage";
import {authorize, call} from "./twitter_authentication";
import growl from "./growly";
import logger from "electron-log";

const openExternal = (url: string) => {
  shell.openExternal(url);
};

const openTweetMenu = (context: TheMoodyBlues.TweetMenu) => {
  ipcRenderer.send("openTweetMenu", context);
};

const TheMoodyBlues: TheMoodyBlues = {
  agent: {
    authorize: authorize,
    call: call,
  },
  storage: buildDefaultStorage(),
  growl: growl,
  openTweetMenu: openTweetMenu,
  openExternal: openExternal,
  logger: logger,
  ipc: {
    observe: (event, callback) => ipcRenderer.on(event, callback),
    action: (event, ...values) => ipcRenderer.send(event, ...values),
    call: (event, ...values) => ipcRenderer.sendSync(event, ...values),
  },
  extra: {
    openExternal: (url: string) => shell.openExternal(url),
    copy: (text: string) => clipboard.writeText(text),
  },
};
contextBridge.exposeInMainWorld("TheMoodyBlues", TheMoodyBlues);
