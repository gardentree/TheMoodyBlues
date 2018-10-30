import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {rewires} from "../../helper";

const [initialize, reorder, searchTweets] = rewires("renderer/sagas/twitter", ["initialize", "reorder", "searchTweets"]);

describe(reorder.name, () => {
  it("assign tab", () => {
    return expectSaga(reorder, {
      payload: {},
      meta: {force: false, tab: "Search"},
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
                contents: {
                  Search: {tweets: [], query: "くえりー"},
                },
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
        type: "Search_STOP_TIMER",
      })
      .put({
        type: "UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {tab: "Search"},
      })
      .put({
        type: "Search_START_TIMER",
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
  it("normal", () => {
    return expectSaga(searchTweets, {payload: {query: "くえりー"}})
      .provide({
        select() {
          return {
            home: {
              tab: "Timeline",
              contents: {
                Search: {tweets: [], query: ""},
              },
            },
          };
        },
      })
      .put({
        type: "SELECT_TAB",
        payload: {tab: "Search"},
      })
      .put({
        type: "SETUP_SEARCH",
        payload: {query: "くえりー"},
      })
      .put({
        type: "Search_STOP_TIMER",
      })
      .put({
        type: "SETUP_SEARCH",
        payload: {query: ""},
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.be.undefined;
      });
  });
});
