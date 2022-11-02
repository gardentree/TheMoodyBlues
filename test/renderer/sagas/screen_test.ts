import {expectSaga} from "redux-saga-test-plan";
import {reorder, reorderFocusedScreen, searchTweets} from "@source/renderer/sagas/screen/stories";
import adapters from "@source/renderer/libraries/adapter";
import {builders, fail} from "@test/helper";
import {GATEKEEPER} from "@source/shared/defaults";

describe(reorder.name, () => {
  it("reload", () => {
    const screen = builders.state.buildScreen({identifier: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const backstage = builders.preference.buildBackstage({identifier: "search"});
    const backstages = adapters.backstages.addOne(adapters.backstages.getInitialState(), backstage);

    return expectSaga(reorder, {
      type: "",
      payload: {identifier: "search"},
      meta: {force: false},
    })
      .provide([
        {
          select() {
            return {
              screens: screens,
              backstages,
              principal: {
                focused: "Timeline",
              },
              gatekeeper: GATEKEEPER,
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
            return;
          },
        },
      ])
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "screens/updateTweets",
        payload: {identifier: "search", tweets: [], options: {query: "くえりー"}},
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
    const screen = builders.state.buildScreen({identifier: "search", options: {query: "くえりー"}});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), screen);

    const backstage = builders.preference.buildBackstage({identifier: "search"});
    const backstages = adapters.backstages.addOne(adapters.backstages.getInitialState(), backstage);

    return expectSaga(reorderFocusedScreen as SagaType, {
      payload: {},
      meta: {force: false},
    })
      .provide([
        {
          select() {
            return {
              screens: screens,
              backstages,
              principal: {
                focused: "search",
              },
              gatekeeper: GATEKEEPER,
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
            return;
          },
        },
      ])
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "screens/updateTweets",
        payload: {identifier: "search", tweets: [], options: {query: "くえりー"}},
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
    identifier: "search",
    options: {
      query: "くえりー",
    },
  });
  const screens = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
  const backstage = builders.preference.buildBackstage({
    identifier: "search",
  });

  const backstages = adapters.backstages.addMany(adapters.backstages.getInitialState(), [backstage]);

  it("normal", () => {
    return expectSaga(searchTweets, {type: "", payload: {identifier: "search", query: "くえりー"}})
      .provide({
        select() {
          return {
            agent: {
              search: () => {
                return [];
              },
            },
            screens: screens,
            backstages,
            principal: {
              focused: "Timeline",
            },
            gatekeeper: GATEKEEPER,
          };
        },
      })
      .put({
        type: "principal/focusScreen",
        payload: "search",
      })
      .put({
        type: "screens/setupSearch",
        payload: {identifier: "search", query: "くえりー"},
      })
      .put({
        type: "search_STOP_TIMER",
      })
      .put({
        type: "screens/updateTweets",
        payload: {identifier: "search", tweets: [], options: {query: "くえりー"}},
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
