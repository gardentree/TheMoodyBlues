import adapters from "@source/renderer/libraries/adapter";
import {GATEKEEPER} from "@source/shared/defaults";
import nodeUtility from "util";
import {builders} from "./helper";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = nodeUtility.TextEncoder;
}

function createInitialStorage() {
  return {
    gatekeeper: GATEKEEPER,
    backstages: adapters.backstages.getInitialState(),
    tweets: {},
  };
}
let storage = createInitialStorage();
afterEach(() => {
  storage = createInitialStorage();
});

export const facade: TMB.Facade = {
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
    getGatekeeper: () => Promise.resolve(storage.gatekeeper),
    setGatekeeper: (gatekeeper: TMB.Gatekeeper) => {
      storage.gatekeeper = gatekeeper;
    },
    getBackstages: () => Promise.resolve(storage.backstages),
    setBackstages: (backstages: TMB.NormalizedBackstage) => {
      storage.backstages = backstages;
    },
    getTweets: (name) => Promise.resolve(storage.tweets[name]),
    setTweets: (name, tweets) => {
      storage.tweets[name] = tweets;
    },
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

global.window.alert = (message) => {
  console.error(message);
};
