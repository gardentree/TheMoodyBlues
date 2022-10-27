import {mixPreferences} from "@libraries/screen";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

const HOME = builders.state.buildScreenPreference({
  identifier: "home",
});
const SEARCH = builders.state.buildScreenPreference({
  identifier: "search",
});
const MENTIONS = builders.state.buildScreenPreference({
  identifier: "mentions",
});

describe("mixPreferences", () => {
  it("when add empty", () => {
    const current = adapters.preferences.addMany(adapters.preferences.getInitialState(), [HOME, SEARCH, MENTIONS]);

    expect(mixPreferences(current, []).entities).toEqual({
      home: HOME,
      search: SEARCH,
      mentions: MENTIONS,
    });
  });

  it("when add list", () => {
    const current = adapters.preferences.addMany(adapters.preferences.getInitialState(), [HOME, SEARCH, MENTIONS]);

    const list = builders.state.buildScreenPreference({
      identifier: "list_news",
      title: "News",
      growl: true,
      parameters: ["news"],
    });

    expect(
      mixPreferences(current, [
        {
          id_str: "news",
          name: "News",
        },
      ]).entities
    ).toEqual({
      home: HOME,
      [list.identifier]: list,
      search: SEARCH,
      mentions: MENTIONS,
    });
  });

  it("modify", () => {
    const home = Object.assign({}, HOME, {interval: 240});
    const current = adapters.preferences.addMany(adapters.preferences.getInitialState(), [home, SEARCH, MENTIONS]);

    expect(mixPreferences(current, []).entities).toEqual({
      home,
      search: SEARCH,
      mentions: MENTIONS,
    });
  });
});
