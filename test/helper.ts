import {JSDOM} from "jsdom";
import sinon from "sinon";
import {faker} from "@faker-js/faker";

const dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const facade = {
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

export const mochaHooks = {
  clock: null,
  beforeEach(done) {
    this.clock = sinon.useFakeTimers(Date.now());

    done();
  },
  afterEach(done) {
    this.clock.restore();

    done();
  },
};

import * as DateUtility from "date-fns";
function buildScreen(specifics?: Partial<TMB.Screen>): TMB.Screen {
  return Object.assign(
    {
      identity: faker.helpers.unique(faker.datatype.uuid),
      tweets: [],
      mode: "tweet",
      lastReadID: "",
      status: {status: ""},
    },
    specifics
  );
}
function buildPreference(specifics?: Partial<TMB.Preference>): TMB.Preference {
  const identity = specifics?.identity || faker.helpers.unique(faker.datatype.uuid);

  return Object.assign(
    {
      identity: identity,
      screen: buildScreenPreference({identity}),
      mute: buildMutePreference(),
    },
    specifics
  );
}
function buildScreenPreference(specifics?: Partial<TMB.ScreenPreference>): TMB.ScreenPreference {
  let preference: TMB.ScreenPreference | null;
  switch (specifics?.identity) {
    case "home":
    case undefined:
      preference = {
        identity: "home",
        title: "Home",
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
        mute: true,
        growl: false,
        active: true,
      };
      break;
    case "search":
      preference = {
        identity: "search",
        title: "Search",
        component: "Search",
        interval: 60,
        way: "search",
        mute: false,
        growl: false,
        active: true,
      };
      break;
    case "mentions":
      preference = {
        identity: "mentions",
        title: "Mentions",
        component: "Timeline",
        interval: 300,
        way: "retrieveMentions",
        mute: false,
        growl: true,
        active: true,
      };
      break;
    default:
      preference = {
        identity: specifics!.identity!,
        title: "List",
        component: "Timeline",
        interval: 120,
        way: "retrieveTimelineOfList",
        mute: true,
        growl: false,
        active: true,
      };
  }

  return Object.assign(preference, specifics);
}
function buildMutePreference(specifics?: Partial<TMB.MutePreference>): TMB.MutePreference {
  return Object.assign(
    {
      keywords: [],
      retweetYourself: false,
      withMedia: [],
      retweetReaction: [],
    },
    specifics
  );
}
function buildTweet(specifics?: Partial<Twitter.Tweet>): Twitter.Tweet {
  const id_str = specifics?.id_str || faker.helpers.unique(faker.random.numeric);
  const full_text = specifics?.full_text || faker.lorem.lines();

  return Object.assign(
    {
      id: parseInt(id_str),
      id_str,
      full_text: full_text,
      user: {},
      display_text_range: [0, full_text.length],
      entities: {
        user_mentions: [],
        urls: [],
        hashtags: [],
      },
      created_at: DateUtility.format(faker.date.past(), "E MMM d H:m:s x yyyy"),
      in_reply_to_status_id_str: null,
      is_quote_status: false,
    },
    specifics
  );
}
export const builders = {
  buildScreen,
  buildPreference,
  buildScreenPreference,
  buildMutePreference,
  buildTweet,
};
