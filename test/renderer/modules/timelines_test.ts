import {expect} from "chai";
import * as timelines from "@actions/timelines";
import {default as reducer} from "@actions/timelines";

const template = new Map([
  [
    "home",
    {
      meta: {
        identity: "home",
        title: "Home",
        component: "Timeline",
        interval: 120,
        way: "timeline",
      },
      tweets: [],
      state: {
        lastReadID: 0,
      },
    },
  ],
  [
    "search",
    {
      meta: {
        identity: "search",
        title: "Search",
        component: "Search",
        interval: 60,
        way: "search",
      },
      tweets: [],
      state: {
        lastReadID: 0,
      },
    },
  ],
  [
    "mentions",
    {
      meta: {
        identity: "mentions",
        title: "Mentions",
        component: "Timeline",
        interval: 300,
        way: "retrieveMentions",
      },
      tweets: [],
      state: {
        lastReadID: 0,
      },
    },
  ],
]);

describe(reducer.name, () => {
  it("updateTweets", () => {
    expect(reducer(template, timelines.updateTweets([], "home"))).to.deep.equal(template);
  });
  it("updateTweets", () => {
    const oldTimelines = new Map(template);
    oldTimelines.get("home").tweets = [{id: 1}];

    const newTimelines = new Map(template);
    newTimelines.get("home").tweets = [{id: 2}, {id: 1}];

    expect(reducer(oldTimelines, timelines.updateTweets([{id: 2}, {id: 1}], "home"))).to.deep.equal(newTimelines);
  });

  it("read", () => {
    const oldTimelines = new Map(template);
    oldTimelines.get("home").tweets = [{id: 1}];
    oldTimelines.get("home").state = {lastReadID: 0};

    const newTimelines = new Map(template);
    newTimelines.get("home").tweets = [{id: 1}];
    newTimelines.get("home").state = {lastReadID: 1};

    expect(reducer(oldTimelines, timelines.read("home", 1))).to.deep.equal(newTimelines);
  });

  describe("setupSearch", () => {
    it("compile", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").state = {query: "くえりー"};

      expect(reducer(template, timelines.setupSearch("search", "くえりー"))).to.deep.equal(newTimelines);
    });
    it("trim query", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").state = {query: "く え り ー"};

      expect(reducer(template, timelines.setupSearch("search", " く え り ー "))).to.deep.equal(newTimelines);
    });
    it("when query is null", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").state = {query: ""};

      expect(reducer(template, timelines.setupSearch("search", null))).to.deep.equal(newTimelines);
    });
  });
});
