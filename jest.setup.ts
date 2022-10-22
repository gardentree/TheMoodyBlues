import nodeUtility from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = nodeUtility.TextEncoder;
}

const facade: TMB.Facade = {
  agent: {
    get: (path, parameters) => Promise.resolve([]),
    retrieveTimeline: (since_id) => Promise.resolve([]),
    search: (query, since_id) => Promise.resolve([]),
    retrieveTimelineOfUser: (name) => Promise.resolve([]),
    retrieveMentions: (since_id) => Promise.resolve([]),
    retrieveConversation: (criterion, options) => Promise.resolve([]),
    lists: () => Promise.resolve([]),
    retrieveTimelineOfList: (list_id, since_id) => Promise.resolve([]),
  },
  storage: {
    getMuteKeywords: () => {},
    setMuteKeywords: (keywords: string[]) => {},
    getScreenPreferences: () => {},
    setScreenPreferences: (screens: TMB.ScreenPreference[]) => {},
    getTweets: (name: string) => {},
    setTweets: (name: string, tweets: Twitter.Tweet[]) => {},
  },
  growl: (tweets: Twitter.Tweet[]) => {},
  openTweetMenu: (context: TMB.TweetMenu) => {},
  openExternal: (url: string) => {},
  logger: {info: () => {}, verbose: () => {}, error: () => {}},
};

global.window.facade = facade;
