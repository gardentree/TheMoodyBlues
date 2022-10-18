import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {reorder, reorderFocusedScreen, searchTweets} from "@source/renderer/sagas/screen/stories";
import adapters from "@source/renderer/libraries/adapter";

describe(reorder.name, () => {
  it("reload", () => {
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), {identity: "search", tweets: [], options: {query: "くえりー"}});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), {
      identity: "search",
      screen: {identity: "search", component: "Search"},
    });

    return expectSaga(reorder, {
      payload: {identity: "search"},
      meta: {force: false},
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
        payload: {tweets: [], options: {query: "くえりー"}},
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
  it("reloadFocusedScreen", () => {
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), {identity: "search", tweets: [], options: {query: "くえりー"}});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), {
      identity: "search",
      screen: {identity: "search", component: "Search"},
    });

    return expectSaga(reorderFocusedScreen, {
      payload: {},
      meta: {force: false},
    })
      .provide([
        {
          select() {
            return {
              screens: screens,
              preferences: preferences,
              principal: {
                focused: "search",
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
        payload: {tweets: [], options: {query: "くえりー"}},
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
  const screens = adapters.screens.addMany(adapters.screens.getInitialState(), [
    {
      identity: "search",
      tweets: [],
      options: {
        query: "くえりー",
      },
    },
  ]);
  const preferences = adapters.preferences.addMany(adapters.screens.getInitialState(), [
    {
      identity: "search",
      screen: {identity: "search", component: "Search"},
    },
  ]);

  it("normal", () => {
    return expectSaga(searchTweets, {payload: {identity: "search", query: "くえりー"}})
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
        payload: {tweets: [], options: {query: "くえりー"}},
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
