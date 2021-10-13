import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";

const [initialize, reorder, searchTweets] = rewires("renderer/sagas/twitter", ["initialize", "reorder", "searchTweets"]);

describe(reorder.name, () => {
  it("assign tab", () => {
    const timelines = new Map([["search", {meta: {identity: "search", component: "Search"}, tweets: [], state: {query: "くえりー"}}]]);

    return expectSaga(reorder, {
      payload: {},
      meta: {force: false, tab: "search"},
    })
      .provide([
        {
          select() {
            return {
              account: {
                search: () => {
                  return [];
                },
              },
              home: {
                tab: "Timeline",
                timelines: timelines,
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
  const timelines = new Map([
    [
      "search",
      {
        meta: {identity: "search", component: "Search"},
        tweets: [],
        state: {
          query: "くえりー",
        },
      },
    ],
  ]);

  it("normal", () => {
    return expectSaga(searchTweets, {payload: {query: "くえりー"}, meta: {identity: "search"}})
      .provide({
        select() {
          return {
            account: {
              search: () => {
                return [];
              },
            },
            home: {
              tab: "Timeline",
              timelines: timelines,
            },
          };
        },
      })
      .put({
        type: "SELECT_TAB",
        payload: {identity: "search"},
      })
      .put({
        type: "SETUP_SEARCH",
        payload: {query: "くえりー"},
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
