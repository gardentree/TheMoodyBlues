import {contextBridge, ipcRenderer} from "electron";
import {Actions as FacadeActions} from "@shared/facade";
import {environment} from "@shared/tools";

let logger;
if (!environment.isTest()) {
  logger = {
    info: (message: TMB.LogMessage) => {
      console.log(message);
    },
    error: (message: TMB.LogMessage) => {
      console.error(message);
    },
    verbose: (message: TMB.LogMessage) => {
      console.debug(message);
    },
  };
} else {
  logger = {
    info: (message: TMB.LogMessage) => {},
    error: (message: TMB.LogMessage) => {},
    verbose: (message: TMB.LogMessage) => {},
  };
}

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
    getBackstages: () => ipcRenderer.invoke(FacadeActions.STORAGE_BACKSTAGES_LOAD),
    setBackstages: (screens) => ipcRenderer.send(FacadeActions.STORAGE_BACKSTAGES_SAVE, {screens}),
    getTweets: (name) => ipcRenderer.invoke(FacadeActions.STORAGE_TWEETS_LOAD, {name}),
    setTweets: (name, tweets) => ipcRenderer.send(FacadeActions.STORAGE_TWEETS_SAVE, {name, tweets}),
    getGatekeeper: () => ipcRenderer.invoke(FacadeActions.STORAGE_GATEKEEPER_LOAD),
    setGatekeeper: (preference) => ipcRenderer.send(FacadeActions.STORAGE_GATEKEEPER_SAVE, {preference}),
  },
  actions: {
    authorize: (verifier) => ipcRenderer.send(FacadeActions.AUTHORIZE, {verifier}),
    copy: (text) => ipcRenderer.send(FacadeActions.COPY_TO_CLIPBOARD, {text}),
    growl: (tweets) => ipcRenderer.send(FacadeActions.GROWL, {tweets}),
    openExternal: (url) => ipcRenderer.send(FacadeActions.OPEN_EXTERNAL, {url}),
    openTweetMenu: (context) => ipcRenderer.send(FacadeActions.OPEN_TWEET_MENU, context),
    showModeMenu: (identifier, mode) => ipcRenderer.send(FacadeActions.SHOW_MODE_MENU, {identifier, mode}),
  },
  events: {
    onAlert: (callback) => ipcRenderer.on(FacadeActions.ALERT, (event, error) => callback(error)),
    onCopyTweetInJSON: (callback) => ipcRenderer.on(FacadeActions.COPY_TWEET_IN_JSON, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onDialog: (callback) => ipcRenderer.on(FacadeActions.DIALOG, (event, context: TMB.TweetMenu) => callback(context)),
    onFocusLatestTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_LATEST_TWEET, (event, ...values) => callback()),
    onFocusTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_TWEET, (event, tweet) => callback(tweet)),
    onFocusUnreadTweet: (callback) => ipcRenderer.on(FacadeActions.FOCUS_UNREAD_TWEET, (event, ...values) => callback()),
    onForceReload: (callback) => ipcRenderer.on(FacadeActions.FORCE_RELOAD, (event, ...values) => callback()),
    onLaunch: (callback) => ipcRenderer.on(FacadeActions.LAUNCH, (event, ...values) => callback()),
    onOpenTweetInBrowser: (callback) => ipcRenderer.on(FacadeActions.OPEN_TWEET_IN_BROWSER, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onReload: (callback) => ipcRenderer.on(FacadeActions.RELOAD, (event, ...values) => callback()),
    onSearch: (callback) => ipcRenderer.on(FacadeActions.SEARCH, (event, context: TMB.TweetMenu) => callback(context.keyword)),
    onShowChainForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CHAIN_FOR_TWEET, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onShowConversationForTweet: (callback) => ipcRenderer.on(FacadeActions.SHOW_CONVERSATION_FOR_TWEET, (event, context: TMB.TweetMenu) => callback(context.tweet)),
    onChangeMode: (callback) =>
      ipcRenderer.on(FacadeActions.CHANGE_MODE, (event, {identifier, mode}) => {
        callback(identifier, mode);
      }),
    onShowVerifierForm: (callback) => ipcRenderer.on(FacadeActions.SHOW_VERIFIER_FORM, (event, ...values) => callback()),
    onZoomIn: (callback) => ipcRenderer.on(FacadeActions.ZOOM_IN, (event, ...values) => callback()),
    onZoomOut: (callback) => ipcRenderer.on(FacadeActions.ZOOM_OUT, (event, ...values) => callback()),
    onZoomReset: (callback) => ipcRenderer.on(FacadeActions.ZOOM_RESET, (event, ...values) => callback()),
  },
  collaborators: {
    growl: () => ipcRenderer.sendSync(FacadeActions.GROWL_IS_RUNNING),
  },
  logger,
};
contextBridge.exposeInMainWorld("facade", facade);
