import {build} from "@source/main/processing/storage";
import {EVERYONE} from "@source/shared/defaults";

const HOME = {
  identifier: "home",
  title: "Home",
  component: "Timeline",
  interval: 120,
  way: "retrieveTimeline",
  mute: true,
  growl: true,
  active: true,
};
const SEARCH = {
  identifier: "search",
  title: "Search",
  component: "Search",
  interval: 60,
  way: "search",
  mute: false,
  growl: false,
  active: true,
};
const MENTIONS = {
  identifier: "mentions",
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
    expect(storage.getBackstages()).toEqual([HOME, SEARCH, MENTIONS]);
  });
  it("gatekeeper", () => {
    expect(storage.getGatekeeper()).toEqual({
      passengers: {
        [EVERYONE]: {
          identifier: EVERYONE,
          name: "全員",
          taboos: {},
        },
      },
      checkedAt: expect.anything(),
    });
  });
});
