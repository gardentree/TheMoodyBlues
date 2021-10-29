import {expect} from "chai";
import {mixPreferences} from "@libraries/timeline";

const HOME = {
  identity: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
};
const SEARCH = {
  identity: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: true,
};
const MENTIONS = {
  identity: "mentions",
  title: "Mentions",
  component: "Timeline",
  interval: 300,
  way: "retrieveMentions",
  mute: false,
  growl: true,
};
const LIST = {
  component: "Timeline",
  interval: 120,
  way: "retrieveTimelineOfList",
  mute: true,
  growl: true,
};

describe("mixPreferences", () => {
  it("same", () => {
    const actives = [HOME, SEARCH, MENTIONS];

    expect(mixPreferences(actives, [])).to.deep.equal([Object.assign({active: true}, HOME), Object.assign({active: true}, SEARCH), Object.assign({active: true}, MENTIONS)]);
  });

  it("add list", () => {
    const actives = [HOME, SEARCH, MENTIONS];

    expect(
      mixPreferences(actives, [
        {
          id_str: "news",
          name: "News",
        },
      ])
    ).to.deep.equal([Object.assign({active: true}, HOME), Object.assign({}, LIST, {identity: "list_news", title: "News", parameters: ["news"]}), Object.assign({active: true}, SEARCH), Object.assign({active: true}, MENTIONS)]);
  });

  it("modify", () => {
    const actives = [Object.assign({}, HOME, {interval: 240}), SEARCH, MENTIONS];

    expect(mixPreferences(actives, [])).to.deep.equal([Object.assign({active: true}, HOME, {interval: 240}), Object.assign({active: true}, SEARCH), Object.assign({active: true}, MENTIONS)]);
  });
});
