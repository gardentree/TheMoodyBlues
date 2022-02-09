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
    getTimelinePreferences: () => ipcRenderer.invoke(FacadeActions.STORAGE_TIMELINE_PREFERENCES_LOAD),
    setTimelinePreferences: (timelines) => ipcRenderer.send(FacadeActions.STORAGE_TIMELINE_PREFERENCES_SAVE, {timelines}),
    getTweets: (name) => ipcRenderer.invoke(FacadeActions.STORAGE_TWEETS_LOAD, {name}),
    setTweets: (name, tweets) => ipcRenderer.send(FacadeActions.STORAGE_TWEETS_SAVE, {name, tweets}),
    getMutePreference: () => ipcRenderer.invoke(FacadeActions.STORAGE_MUTE_LOAD),
    setMutePreference: (preference) => ipcRenderer.send(FacadeActions.STORAGE_MUTE_SAVE, {preference}),
  },
  growl: (tweets) => ipcRenderer.send(FacadeActions.GROWL, {tweets}),
  openTweetMenu: (context) => ipcRenderer.send(FacadeActions.OPEN_TWEET_MENU, context),
  openExternal: (url) => shell.openExternal(url),
  logger: logger,
  ipc: {
    onAlert: (callback) => ipcRenderer.on(FacadeActions.ALERT, (event, error: unknown) => callback(error)),
    onCopyTweetInJSON: (callback) => ipcRenderer.on(FacadeActions.COPY_TWEET_IN_JSON, (event, context: TweetMenu) => callback(context.tweet)),
    onFocusLatestTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_LATEST_TWEET, (event, ...values) => callback()),
    onFocusUnreadTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_UNREAD_TWEET, (event, ...values) => callback()),
    onForceReload: (callback) => ipcRenderer.on(FacadeActions.FORCE_RELOAD, (event, ...values) => callback()),
    onLaunch: (callback) => ipcRenderer.on(FacadeActions.LAUNCH, (event, ...values) => callback()),
    onOpenTweetInBrowser: (callback) => ipcRenderer.on(FacadeActions.OPEN_TWEET_IN_BROWSER, (event, context: TweetMenu) => callback(context.tweet)),
    onRefreshPreferences: (callback) => ipcRenderer.on(FacadeActions.REFRESH_PREFERENCES, (event, ...values) => callback()),
    onReload: (callback) => ipcRenderer.on(FacadeActions.RELOAD, (event, ...values) => callback()),
    onSearch: (callback) => ipcRenderer.on(FacadeActions.SEARCH, (event, context: TweetMenu) => callback(context.keyword)),
    onShowChainForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CHAIN_FOR_TWEET, (event, context: TweetMenu) => callback(context.tweet)),
    onShowConversationForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CONVERSATION_FOR_TWEET, (event, context: TweetMenu) => callback(context.tweet)),
    onShowVerifierForm: (callback) => ipcRenderer.on(FacadeActions.SHOW_VERIFIER_FORM, (event, ...values) => callback()),
    onZoomIn: (callback) => ipcRenderer.on(FacadeActions.ZOOM_IN, (event, ...values) => callback()),
    onZoomOut: (callback) => ipcRenderer.on(FacadeActions.ZOOM_OUT, (event, ...values) => callback()),
    onZoomReset: (callback) => ipcRenderer.on(FacadeActions.ZOOM_RESET, (event, ...values) => callback()),

    dispatchAuthorize: (verifier: string) => ipcRenderer.send(FacadeActions.AUTHORIZE, {verifier}),
  },
  extra: {
    openExternal: (url: string) => shell.openExternal(url),
    copy: (text: string) => clipboard.writeText(text),
  },
};
contextBridge.exposeInMainWorld("facade", facade);
