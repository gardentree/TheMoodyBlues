import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {rewires} from "../../helper";

const [initialize, reorder, searchTweets] = rewires("renderer/sagas/twitter", ["initialize", "reorder", "searchTweets"]);

describe(initialize.name, () => {
  it("Timeline", () => {
    return expectSaga(initialize, {payload: {tab: "Timeline"}})
      .provide([
        {
          select() {
            return {
              account: {},
              home: {},
            };
          },
        },
        {
          call(effect: any, next: any) {
            return [{id: 1}];
          },
        },
        {
          fork(effect: any, next: any) {
            expect(effect.fn.name).to.equal("runTimer");
            expect(effect.args).to.deep.equal(["Timeline", 120 * 1000]);
          },
        },
      ])
      .put({
        type: "SELECT_TAB",
        payload: {tab: "Timeline"},
      })
      .put({
        type: "UPDATE_TWEETS",
        payload: {tweets: [{id: 1}]},
        meta: {tab: "Timeline"},
      })
      .put({
        type: "READ",
        payload: {lastReadID: 1},
      })
      .put({
        type: "Timeline_STOP_TIMER",
      })
      .put({
        type: "Timeline_START_TIMER",
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.have.lengthOf(1);
        expect(effects.fork).to.have.lengthOf(1);
      });
  });
  it("Search", () => {
    return expectSaga(initialize, {payload: {tab: "Search"}})
      .provide([
        {
          select() {
            return {
              account: {},
              home: {},
            };
          },
        },
      ])
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.be.undefined;
        expect(effects.fork).to.have.lengthOf(1);
      });
  });
});

describe(reorder.name, () => {
  describe("Timeline", () => {
    it("normal", () => {
      return expectSaga(reorder, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .provide([
          {
            select() {
              return {
                account: {
                  timeline: () => {
                    return [{id_str: "1"}];
                  },
                },
                home: {
                  tab: "Timeline",
                  contents: {
                    Timeline: {tweets: [{id_str: "old_1"}]},
                  },
                },
              };
            },
          },
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "timeline":
                  expect(effect.args[0]).to.equal("old_1");
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.deep.equal([{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]);
                  return;
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]},
          meta: {tab: "Timeline"},
        })
        .put({type: "Timeline_STOP_TIMER"})
        .put({type: "Timeline_START_TIMER"})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
        });
    });

    it("force reload", () => {
      return expectSaga(reorder, {
        payload: {},
        meta: {
          force: true,
        },
      })
        .provide([
          {
            select() {
              return {
                account: {
                  timeline: () => {
                    return [{id_str: "1"}];
                  },
                },
                home: {
                  tab: "Timeline",
                  contents: {
                    Timeline: {tweets: [{id_str: "old_1"}]},
                  },
                },
              };
            },
          },
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "timeline":
                  expect(effect.args[0]).to.be.null;
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.deep.equal([{id_str: "new_1"}, {id_str: "new_2"}]);
                  return;
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}]},
          meta: {tab: "Timeline"},
        })
        .put({type: "Timeline_STOP_TIMER"})
        .put({type: "Timeline_START_TIMER"})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
        });
    });
  });

  describe("Search", () => {
    it("normal", () => {
      return expectSaga(reorder, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .provide([
          {
            select() {
              return {
                account: {
                  search: () => {
                    return [{id_str: "1"}];
                  },
                },
                home: {
                  tab: "Search",
                  contents: {
                    Search: {tweets: [{id_str: "old_1"}], query: "くえりー"},
                  },
                },
              };
            },
          },
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "search":
                  expect(effect.args[0]).to.equal("くえりー");
                  expect(effect.args[1]).to.equal("old_1");
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
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
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}], query: "くえりー"},
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
    it("query is blank", () => {
      return expectSaga(reorder, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .provide([
          {
            select() {
              return {
                account: {
                  search: () => {
                    return [{id_str: "1"}];
                  },
                },
                home: {
                  tab: "Search",
                  contents: {
                    Search: {tweets: [{id_str: "old_1"}], query: ""},
                  },
                },
              };
            },
          },
        ])
        .put({
          type: "Search_STOP_TIMER",
        })
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [], query: ""},
          meta: {tab: "Search"},
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.be.undefined;
        });
    });
  });

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
      .put({
        type: "SELECT_TAB",
        payload: {tab: "Search"},
      })
      .put({
        type: "UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {tab: "Search"},
      })
      .put({
        type: "RELOAD",
        payload: null,
        meta: {force: true, tab: "Search"},
      })
      .run();
  });
});
