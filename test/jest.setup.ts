import nodeUtility from "util";
import {builders} from "./helper";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = nodeUtility.TextEncoder;
}

const mutePreference = builders.buildMutePreference();

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
    getTweets: (name: string) => Promise.resolve([]),
    setTweets: (name: string, tweets: Twitter.Tweet[]) => {},
  },
  logger: {info: () => {}, verbose: () => {}, error: () => {}},
  actions: {
    authorize: function (verifier: string): void {},
    copy: function (text: string): void {},
    growl: function (tweets: Twitter.Tweet[]): void {},
    openExternal: function (url: string): void {},
    openTweetMenu: function (context: TMB.TweetMenu): void {},
    showModeMenu: function (identity: string, mode: TMB.ArticleMode): void {},
  },
  events: {
    onAlert: function (callback: (error: unknown) => void): void {},
    onChangeMode: function (callback: (identity: string, mode: TMB.ArticleMode) => void): void {},
    onCopyTweetInJSON: function (callback: (tweet: Twitter.Tweet) => void): void {},
    onFocusLatestTweet: function (callback: () => void): void {},
    onFocusTweet: function (callback: (tweet: Twitter.Tweet) => void): void {},
    onFocusUnreadTweet: function (callback: () => void): void {},
    onForceReload: function (callback: () => void): void {},
    onLaunch: function (callback: () => void): void {},
    onOpenTweetInBrowser: function (callback: (tweet: Twitter.Tweet) => void): void {},
    onRefreshPreferences: function (callback: () => void): void {},
    onReload: function (callback: () => void): void {},
    onSearch: function (callback: (keyword: string) => void): void {},
    onShowChainForTweet: function (callback: (tweet: Twitter.Tweet) => void): void {},
    onShowConversationForTweet: function (callback: (tweet: Twitter.Tweet) => void): void {},
    onShowVerifierForm: function (callback: () => void): void {},
    onZoomIn: function (callback: () => void): void {},
    onZoomOut: function (callback: () => void): void {},
    onZoomReset: function (callback: () => void): void {},
  },
  collaborators: {
    growl: function (): boolean {
      return false;
    },
  },
};

global.window.facade = facade;
