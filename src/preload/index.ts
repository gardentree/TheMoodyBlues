import {contextBridge, ipcRenderer, shell, clipboard} from "electron";
import logger from "electron-log";
import {Actions as FacadeActions} from "@shared/facade";

const facade: Facade = {
  agent: {
    get: (path, parameters) => ipcRenderer.invoke(FacadeActions.AGENT_GET, {path, parameters}),
    retrieveTimeline: (since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE, {since_id}),
    search: (query, since_id) => ipcRenderer.invoke(FacadeActions.AGENT_SEARCH, {query, since_id}),
    retrieveTimelineOfUser: (name) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_USER, {name}),
    retrieveMentions: (since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_MENTIONS, {since_id}),
    retrieveConversation: (criterion, options) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_CONVERSATION, {criterion, options}),
    lists: () => ipcRenderer.invoke(FacadeActions.AGENT_LISTS),
    retrieveTimelineOfList: (list_id, since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_LIST, {list_id, since_id}),
  },
  storage: {
    getTimelinePreferences: () => ipcRenderer.sendSync(FacadeActions.STORAGE_TIMELINE_PREFERENCES_LOAD),
    setTimelinePreferences: (timelines) => ipcRenderer.send(FacadeActions.STORAGE_TIMELINE_PREFERENCES_SAVE, {timelines}),
    getTweets: (name) => ipcRenderer.invoke(FacadeActions.STORAGE_TWEETS_LOAD, {name}),
    setTweets: (name, tweets) => ipcRenderer.send(FacadeActions.STORAGE_TWEETS_SAVE, {name, tweets}),
    getMuteKeywords: () => ipcRenderer.sendSync(FacadeActions.STORAGE_MUTE_LOAD),
    setMuteKeywords: (keywords) => ipcRenderer.sendSync(FacadeActions.STORAGE_MUTE_SAVE, {keywords}),
  },
  growl: (tweets) => ipcRenderer.send(FacadeActions.GROWL, {tweets}),
  openTweetMenu: (context) => ipcRenderer.send("openTweetMenu", context),
  openExternal: (url) => shell.openExternal(url),
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
contextBridge.exposeInMainWorld("facade", facade);
