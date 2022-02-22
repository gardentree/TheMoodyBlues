import {expect} from "chai";
import * as actions from "@actions";
import {default as reducer} from "@reducers/screens";

const template = new Map([
  [
    "home",
    {
      tweets: [],
      lastReadID: "0",
    },
  ],
  [
    "search",
    {
      tweets: [],
      lastReadID: "0",
    },
  ],
  [
    "mentions",
    {
      tweets: [],
      lastReadID: "0",
    },
  ],
]);

describe(reducer.name, () => {
  it("updateTweets", () => {
    expect(reducer(template, actions.updateTweets([], "home"))).to.deep.equal(template);
  });
  it("updateTweets", () => {
    const oldTimelines = new Map(template);
    oldTimelines.get("home").tweets = [{id: 1}];

    const newTimelines = new Map(template);
    newTimelines.get("home").tweets = [{id: 2}, {id: 1}];

    expect(reducer(oldTimelines, actions.updateTweets([{id: 2}, {id: 1}], "home"))).to.deep.equal(newTimelines);
  });

  it("read", () => {
    const oldTimelines = new Map(template);
    oldTimelines.get("home").tweets = [{id: 1}];
    oldTimelines.get("home").lastReadID = 0;

    const newTimelines = new Map(template);
    newTimelines.get("home").tweets = [{id: 1}];
    newTimelines.get("home").lastReadID = 1;

    expect(reducer(oldTimelines, actions.read("home", 1))).to.deep.equal(newTimelines);
  });

  describe("setupSearch", () => {
    it("compile", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").options = {query: "くえりー"};

      expect(reducer(template, actions.setupSearch("search", "くえりー"))).to.deep.equal(newTimelines);
    });
    it("trim query", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").options = {query: "く え り ー"};

      expect(reducer(template, actions.setupSearch("search", " く え り ー "))).to.deep.equal(newTimelines);
    });
    it("when query is null", () => {
      const newTimelines = new Map(template);
      newTimelines.get("search").options = {query: ""};

      expect(reducer(template, actions.setupSearch("search", null))).to.deep.equal(newTimelines);
    });
  });
});
