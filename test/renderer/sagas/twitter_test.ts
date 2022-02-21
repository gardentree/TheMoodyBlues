import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";

const [initialize, reorder, searchTweets] = rewires("renderer/sagas/twitter", ["initialize", "reorder", "searchTweets"]);

describe(reorder.name, () => {
  it("assign tab", () => {
    const screens = new Map([["search", {tweets: [], state: {query: "くえりー"}}]]);
    const preferences = new Map([["search", {screen: {identity: "search", component: "Search"}}]]);

    return expectSaga(reorder, {
      payload: {},
      meta: {force: false, tab: "search"},
    })
      .provide([
        {
          select() {
            return {
              screens: screens,
              preferences: preferences,
              principal: {
                focused: "Timeline",
              },
            };
          },
        },
        {
          call(effect: any, next: any) {
            switch (effect.fn.name) {
              case "search":
                return [];
              default:
                expect.fail(effect.fn.name);
                return;
            }
          },
        },
      ])
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {identity: "search"},
      })
      .put({
        type: "search_START_TIMER",
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.have.lengthOf(1);
      });
  });
});

describe(searchTweets.name, () => {
  const screens = new Map([
    [
      "search",
      {
        tweets: [],
        state: {
          query: "くえりー",
        },
      },
    ],
  ]);
  const preferences = new Map([
    [
      "search",
      {
        screen: {identity: "search", component: "Search"},
      },
    ],
  ]);

  it("normal", () => {
    return expectSaga(searchTweets, {payload: {query: "くえりー"}, meta: {identity: "search"}})
      .provide({
        select() {
          return {
            agent: {
              search: () => {
                return [];
              },
            },
            screens: screens,
            preferences: preferences,
            principal: {
              focused: "Timeline",
            },
          };
        },
      })
      .put({
        type: "SELECT_TAB",
        payload: {focused: "search"},
      })
      .put({
        type: "SETUP_SEARCH",
        payload: {state: {query: "くえりー"}},
        meta: {identity: "search"},
      })
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {identity: "search"},
      })
      .put({
        type: "search_START_TIMER",
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.have.lengthOf(1);
      });
  });
});
