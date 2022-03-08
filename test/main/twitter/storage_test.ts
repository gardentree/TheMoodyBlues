import {expect, use} from "chai";
import sinon from "sinon";
import {build} from "@source/main/twitter/storage";

const HOME = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
  active: true,
};
const SEARCH = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
  active: true,
};
const MENTIONS = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
  active: true,
};

describe("defaults", () => {
  const storage = build(`${__dirname}/storage/defaults`);

  it("screen", () => {
    expect(storage.getScreenPreferences()).to.deep.equal([HOME, SEARCH, MENTIONS]);
  });
  it("mute", () => {
    expect(storage.getMutePreference()).to.deep.equal({
      keywords: [],
      selfRetweet: false,
      withMedia: [],
      retweetReaction: [],
    });
  });
});
