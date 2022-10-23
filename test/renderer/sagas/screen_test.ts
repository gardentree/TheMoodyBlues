import {expectSaga} from "redux-saga-test-plan";
import {reorder, reorderFocusedScreen, searchTweets} from "@source/renderer/sagas/screen/stories";
import adapters from "@source/renderer/libraries/adapter";
import {builders, fail} from "@test/helper";

describe(reorder.name, () => {
  it("reload", () => {
    const screen = builders.state.buildScreen({identity: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const preference = builders.state.buildPreference({identity: "search"});
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
          call(effect, next) {
            switch (effect.fn.name) {
              case "search":
                return [];
              default:
                fail(effect.fn.name);
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

        expect(effects.put).toBeUndefined();
        expect(effects.call).toHaveLength(1);
      });
  });
  it("reloadFocusedScreen", () => {
    const screen = builders.state.buildScreen({identity: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const preference = builders.state.buildPreference({identity: "search"});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), preference);

    return expectSaga(reorderFocusedScreen as SagaType, {
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
          call(effect, next) {
            switch (effect.fn.name) {
              case "search":
                return [];
              default:
                fail(effect.fn.name);
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

        expect(effects.put).toBeUndefined();
        expect(effects.call).toHaveLength(1);
      });
  });
});

describe(searchTweets.name, () => {
  const screen = builders.state.buildScreen({
    identity: "search",
    options: {
      query: "くえりー",
    },
  });
  const screens = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
  const preference = builders.state.buildPreference({
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

        expect(effects.put).toBeUndefined();
        expect(effects.call).toHaveLength(1);
      });
  });
});
