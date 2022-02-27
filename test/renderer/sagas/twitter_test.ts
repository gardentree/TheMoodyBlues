import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";

const [reorder, searchTweets, wrap] = rewires("renderer/sagas/twitter", ["reorder", "searchTweets", "wrap"]);

describe(reorder.name, () => {
  it("assign tab", () => {
    const screens = new Map([["search", {tweets: [], options: {query: "くえりー"}}]]);
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
        options: {
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
        type: "FOCUS_SCREEN",
        payload: {focused: "search"},
      })
      .put({
        type: "SETUP_SEARCH",
        payload: {options: {query: "くえりー"}},
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

describe(wrap.name, () => {
  it("hide loading spinner when alarm", () => {
    function* fail() {
      throw new Error();
    }

    return expectSaga(wrap(fail), {})
      .put({
        type: "SHOW_LOADING",
        payload: {nowLoading: true},
      })
      .put({
        type: "ALARM",
        error: true,
        payload: new Error(),
      })
      .put({
        type: "SHOW_LOADING",
        payload: {nowLoading: false},
      })
      .run();
  });
});
