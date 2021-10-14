import {expect} from "chai";
import {default as reducer} from "../../../src/renderer/modules/home";
import * as home from "../../../src/renderer/modules/home";

const timelines = new Map([
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

const template = {
  tab: null,
  timelines,
  subcontents: {},
  style: {
    fontSize: "12px",
  },
  nowLoading: false,
};

describe(reducer.name, () => {
  it("selectTab", () => {
    expect(reducer(template, home.selectTab("home"))).to.deep.equal({
      tab: "home",
      timelines: {},
      subcontents: {},
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
      timelines,
    });
  });

  it("updateTweets", () => {
    expect(reducer({...template, timelines}, home.updateTweets([], "home"))).to.deep.equal({
      tab: null,
      timelines,
      subcontents: {},
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });
  it(home.updateTweets.toString(), () => {
    const oldTimelines = new Map(timelines);
    oldTimelines.get("home").tweets = [{id: 1}];

    const newTimelines = new Map(timelines);
    newTimelines.get("home").tweets = [{id: 2}, {id: 1}];

    expect(
      reducer(
        {
          ...template,
          tab: "home",
          timelines: oldTimelines,
        },
        home.updateTweets([{id: 2}, {id: 1}], "home")
      )
    ).to.deep.equal({
      tab: "home",
      timelines: newTimelines,
      subcontents: {},
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });

  it("updateTweetsInSubContents", () => {
    expect(reducer(template, home.updateTweetsInSubContents([]))).to.deep.equal({
      tab: null,
      timelines,
      subcontents: {tweets: []},
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });

  it(home.read.toString(), () => {
    const oldTimelines = new Map(timelines);
    oldTimelines.get("home").tweets = [{id: 1}];
    oldTimelines.get("home").state = {lastReadID: 0};

    const newTimelines = new Map(timelines);
    newTimelines.get("home").tweets = [{id: 1}];
    newTimelines.get("home").state = {lastReadID: 1};

    expect(
      reducer(
        {
          ...template,
          tab: "home",
          timelines: oldTimelines,
        },
        home.read(1)
      )
    ).to.deep.equal({
      tab: "home",
      timelines: newTimelines,
      subcontents: {},
      style: {
        fontSize: "12px",
      },
      nowLoading: false,
    });
  });

  it("zoomIn", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomIn())).to.deep.equal({
      style: {
        fontSize: "11px",
      },
      tab: null,
      timelines: timelines,
      subcontents: {},
      nowLoading: false,
      timelines,
    });
  });
  it("zoomOut", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomOut())).to.deep.equal({
      style: {
        fontSize: "9px",
      },
      tab: null,
      timelines: timelines,
      subcontents: {},
      nowLoading: false,
    });
  });
  it("zoomReset", () => {
    expect(reducer({...template, style: {fontSize: "10px"}}, home.zoomReset())).to.deep.equal({
      style: {
        fontSize: "12px",
      },
      tab: null,
      timelines: timelines,
      subcontents: {},
      nowLoading: false,
    });
  });

  describe(home.setupSearch.toString(), () => {
    it("compile", () => {
      const newTimelines = new Map(timelines);
      newTimelines.get("search").state = {query: "くえりー"};

      expect(reducer(template, home.setupSearch("search", "くえりー"))).to.deep.equal({
        tab: null,
        timelines: newTimelines,
        subcontents: {},
        style: {fontSize: "12px"},
        nowLoading: false,
      });
    });
    it("trim query", () => {
      const newTimelines = new Map(timelines);
      newTimelines.get("search").state = {query: "く え り ー"};

      expect(reducer(template, home.setupSearch("search", " く え り ー "))).to.deep.equal({
        tab: null,
        timelines: newTimelines,
        subcontents: {},
        style: {fontSize: "12px"},
        nowLoading: false,
      });
    });
    it("when query is null", () => {
      const newTimelines = new Map(timelines);
      newTimelines.get("search").state = {query: ""};

      expect(reducer(template, home.setupSearch("search", null))).to.deep.equal({
        tab: null,
        timelines: newTimelines,
        subcontents: {},
        style: {fontSize: "12px"},
        nowLoading: false,
      });
    });
  });
});
