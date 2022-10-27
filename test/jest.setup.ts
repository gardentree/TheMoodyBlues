import nodeUtility from "util";
import {builders} from "./helper";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = nodeUtility.TextEncoder;
}

const mutePreference = builders.state.buildMutePreference();

const facade: TMB.Facade = {
  agent: {
    retrieveTimeline: (since_id) => Promise.resolve([]),
    search: (query, since_id) => Promise.resolve([]),
    retrieveTimelineOfUser: (name) => Promise.resolve([]),
    retrieveMentions: (since_id) => Promise.resolve([]),
    retrieveConversation: (criterion, options) => Promise.resolve([]),
    lists: () => Promise.resolve([]),
    retrieveTimelineOfList: (list_id, since_id) => Promise.resolve([]),
  },
  storage: {
    getMutePreference: () => Promise.resolve(mutePreference),
    setMutePreference: () => {},
    getScreenPreferences: () => Promise.resolve([]),
    setScreenPreferences: (screens: TMB.ScreenPreference[]) => {},
    getTweets: (name) => Promise.resolve([]),
    setTweets: (name, tweets) => {},
  },
  logger: {info: () => {}, verbose: () => {}, error: () => {}},
  actions: {
    authorize: (verifier) => {},
    copy: (text) => {},
    growl: (tweets) => {},
    openExternal: (url) => {},
    openTweetMenu: (context) => {},
    showModeMenu: (identifier, mode) => {},
  },
  events: {
    onAlert: (callback) => {},
    onChangeMode: (callback) => {},
    onCopyTweetInJSON: (callback) => {},
    onDialog: (callback) => {},
    onFocusLatestTweet: (callback) => {},
    onFocusTweet: (callback) => {},
    onFocusUnreadTweet: (callback) => {},
    onForceReload: (callback) => {},
    onLaunch: (callback) => {},
    onOpenTweetInBrowser: (callback) => {},
    onRefreshPreferences: (callback) => {},
    onReload: (callback) => {},
    onSearch: (callback) => {},
    onShowChainForTweet: (callback) => {},
    onShowConversationForTweet: (callback) => {},
    onShowVerifierForm: (callback) => {},
    onZoomIn: (callback) => {},
    onZoomOut: (callback) => {},
    onZoomReset: (callback) => {},
  },
  collaborators: {
    growl: function (): boolean {
      return false;
    },
  },
};

global.window.facade = facade;
