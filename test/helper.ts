import {JSDOM} from "jsdom";
import rewire = require("rewire");

const dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const facade: TheMoodyBluesFacade = {
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
    getTimelinePreferences: () => {},
    setTimelinePreferences: (timelines: TheMoodyBlues.TimelinePreference[]) => {},
    getTweets: (name: string) => {},
    setTweets: (name: string, tweets: Twitter.Tweet[]) => {},
  },
  growl: (tweets: Twitter.Tweet[]) => {},
  openTweetMenu: (context: TheMoodyBlues.TweetMenu) => {},
  openExternal: (url: string) => {},
  logger: {info: () => {}, verbose: () => {}, error: () => {}},
};

global.window.facade = facade;

global.rewires = (file: string, functions: string[]) => {
  const rewirer = rewire(`../src/${file}`);

  return functions.map((name) => {
    return rewirer.__get__(name);
  });
};
