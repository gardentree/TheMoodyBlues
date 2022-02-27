import {contextBridge, ipcRenderer, shell, clipboard} from "electron";
import logger from "electron-log";
import {Actions as FacadeActions} from "@shared/facade";

const facade: TMB.Facade = {
  agent: {
    retrieveTimeline: (since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE, {since_id}),
    search: (query, since_id) => ipcRenderer.invoke(FacadeActions.AGENT_SEARCH, {query, since_id}),
    retrieveTimelineOfUser: (name) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_USER, {name}),
    retrieveMentions: (since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_MENTIONS, {since_id}),
    retrieveConversation: (criterion, options) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_CONVERSATION, {criterion, options}),
    lists: () => ipcRenderer.invoke(FacadeActions.AGENT_LISTS),
    retrieveTimelineOfList: (list_id, since_id) => ipcRenderer.invoke(FacadeActions.AGENT_RETRIEVE_TIMELINE_OF_LIST, {list_id, since_id}),
  },
  storage: {
    getScreenPreferences: () => ipcRenderer.invoke(FacadeActions.STORAGE_SCREEN_PREFERENCES_LOAD),
    setScreenPreferences: (screens) => ipcRenderer.send(FacadeActions.STORAGE_SCREEN_PREFERENCES_SAVE, {screens}),
    getTweets: (name) => ipcRenderer.invoke(FacadeActions.STORAGE_TWEETS_LOAD, {name}),
    setTweets: (name, tweets) => ipcRenderer.send(FacadeActions.STORAGE_TWEETS_SAVE, {name, tweets}),
    getMutePreference: () => ipcRenderer.invoke(FacadeActions.STORAGE_MUTE_LOAD),
    setMutePreference: (preference) => ipcRenderer.send(FacadeActions.STORAGE_MUTE_SAVE, {preference}),
  },
  actions: {
    authorize: (verifier) => ipcRenderer.send(FacadeActions.AUTHORIZE, {verifier}),
    copy: (text) => clipboard.writeText(text),
    growl: (tweets) => ipcRenderer.send(FacadeActions.GROWL, {tweets}),
    openExternal: (url) => shell.openExternal(url),
    openTweetMenu: (context) => ipcRenderer.send(FacadeActions.OPEN_TWEET_MENU, context),
    showModeMenu: (identity, mode) => ipcRenderer.send(FacadeActions.SHOW_MODE_MENU, {identity, mode}),
  },
  events: {
    onAlert: (callback) => ipcRenderer.on(FacadeActions.ALERT, (event, error) => callback(error)),
    onCopyTweetInJSON: (callback) => ipcRenderer.on(FacadeActions.COPY_TWEET_IN_JSON, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onFocusLatestTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_LATEST_TWEET, (event, ...values) => callback()),
    onFocusUnreadTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_UNREAD_TWEET, (event, ...values) => callback()),
    onForceReload: (callback) => ipcRenderer.on(FacadeActions.FORCE_RELOAD, (event, ...values) => callback()),
    onLaunch: (callback) => ipcRenderer.on(FacadeActions.LAUNCH, (event, ...values) => callback()),
    onOpenTweetInBrowser: (callback) => ipcRenderer.on(FacadeActions.OPEN_TWEET_IN_BROWSER, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onRefreshPreferences: (callback) => ipcRenderer.on(FacadeActions.REFRESH_PREFERENCES, (event, ...values) => callback()),
    onReload: (callback) => ipcRenderer.on(FacadeActions.RELOAD, (event, ...values) => callback()),
    onSearch: (callback) => ipcRenderer.on(FacadeActions.SEARCH, (event, context: TMB.TweetMenu) => callback(context.keyword)),
    onShowChainForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CHAIN_FOR_TWEET, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onShowConversationForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CONVERSATION_FOR_TWEET, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onChangeMode: (callback) =>
      ipcRenderer.on(FacadeActions.CHANGE_MODE, (event, {identity, mode}) => {
        callback(identity, mode);
      }),
    onShowVerifierForm: (callback) => ipcRenderer.on(FacadeActions.SHOW_VERIFIER_FORM, (event, ...values) => callback()),
    onZoomIn: (callback) => ipcRenderer.on(FacadeActions.ZOOM_IN, (event, ...values) => callback()),
    onZoomOut: (callback) => ipcRenderer.on(FacadeActions.ZOOM_OUT, (event, ...values) => callback()),
    onZoomReset: (callback) => ipcRenderer.on(FacadeActions.ZOOM_RESET, (event, ...values) => callback()),
  },
  logger: logger,
};
contextBridge.exposeInMainWorld("facade", facade);
