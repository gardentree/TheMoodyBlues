import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {reorder, reorderFocusedScreen, searchTweets} from "@source/renderer/sagas/screen/stories";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe(reorder.name, () => {
  it("reload", () => {
    const screen = builders.buildScreen({identity: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const preference = builders.buildPreference({identity: "search"});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), preference);

    return expectSaga(reorder, {
      type: "",
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
        type: "screens/updateTweets",
        payload: {identity: "search", tweets: [], options: {query: "くえりー"}},
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
    const screen = builders.buildScreen({identity: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const preference = builders.buildPreference({identity: "search"});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), preference);

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
        type: "screens/updateTweets",
        payload: {identity: "search", tweets: [], options: {query: "くえりー"}},
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
  const screen = builders.buildScreen({
    identity: "search",
    options: {
      query: "くえりー",
    },
  });
  const screens = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
  const preference = builders.buildPreference({
    identity: "search",
  });

  const preferences = adapters.preferences.addMany(adapters.preferences.getInitialState(), [preference]);

  it("normal", () => {
    return expectSaga(searchTweets, {type: "", payload: {identity: "search", query: "くえりー"}})
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
        type: "principal/focusScreen",
        payload: "search",
      })
      .put({
        type: "screens/setupSearch",
        payload: {identity: "search", query: "くえりー"},
      })
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "screens/updateTweets",
        payload: {identity: "search", tweets: [], options: {query: "くえりー"}},
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
