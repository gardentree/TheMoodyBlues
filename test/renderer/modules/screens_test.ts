import {expect} from "chai";
import * as actions from "@actions";
import {default as reducer} from "@reducers/screens";
import adapters from "@source/renderer/libraries/adapter";

const template = adapters.screens.addMany(adapters.screens.getInitialState(), [
  {
    identity: "home",
    tweets: [],
    lastReadID: "0",
  },
  {
    identity: "search",
    tweets: [],
    lastReadID: "0",
  },
  {
    identity: "mentions",
    tweets: [],
    lastReadID: "0",
  },
]);

describe(reducer.name, () => {
  it("updateTweets", () => {
    expect(reducer(template, actions.updateTweets("home", []))).to.deep.equal(template);
  });
  it("updateTweets", () => {
    const oldTimelines = adapters.screens.updateOne(template, {id: "home", changes: {tweets: [{id: 1}]}});
    const newTimelines = adapters.screens.updateOne(template, {id: "home", changes: {tweets: [{id: 2}, {id: 1}]}});

    expect(reducer(oldTimelines, actions.updateTweets("home", [{id: 2}, {id: 1}]))).to.deep.equal(newTimelines);
  });

  it("mark", () => {
    const oldTimelines = adapters.screens.updateOne(template, {id: "home", changes: {tweets: [{id: 1}], lastReadID: 0}});
    const newTimelines = adapters.screens.updateOne(template, {id: "home", changes: {tweets: [{id: 1}], lastReadID: 1}});

    expect(reducer(oldTimelines, actions.mark("home", 1))).to.deep.equal(newTimelines);
  });

  describe("setupSearch", () => {
    it("compile", () => {
      const newTimelines = adapters.screens.updateOne(template, {id: "search", changes: {options: {query: "くえりー"}}});

      expect(reducer(template, actions.setupSearch("search", "くえりー"))).to.deep.equal(newTimelines);
    });
    it("trim query", () => {
      const newTimelines = adapters.screens.updateOne(template, {id: "search", changes: {options: {query: "く え り ー"}}});

      expect(reducer(template, actions.setupSearch("search", " く え り ー "))).to.deep.equal(newTimelines);
    });
    it("when query is null", () => {
      const newTimelines = adapters.screens.updateOne(template, {id: "search", changes: {options: {query: ""}}});

      expect(reducer(template, actions.setupSearch("search", null))).to.deep.equal(newTimelines);
    });
  });
});
