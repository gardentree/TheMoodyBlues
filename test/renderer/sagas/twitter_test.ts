import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {rewires} from "../../helper";

const [initialize, reorder, searchTweets] = rewires("renderer/sagas/twitter", ["initialize", "reorder", "searchTweets"]);

describe(initialize.name, () => {
  it("Timeline", () => {
    return expectSaga(initialize, {payload: {screen: "Timeline"}})
      .provide([
        {
          select() {
            return {account: {}};
          },
        },
        {
          call(effect: any, next: any) {
            return [];
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
        type: "SELECT_CONTENT",
        payload: {name: "Timeline"},
        meta: null,
        error: false,
      })
      .put({
        type: "SYSTEM_UPDATE_TWEETS",
        payload: {tweets: []},
        meta: {name: "Timeline"},
        error: false,
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
    return expectSaga(initialize, {payload: {screen: "Search"}})
      .provide([
        {
          select() {
            return {account: {}};
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
                screen: {
                  name: "Timeline",
                },
                contents: {
                  Timeline: {tweets: [{id_str: "old_1"}]},
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
          type: "SYSTEM_UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]},
          meta: {name: "Timeline"},
          error: false,
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
                screen: {
                  name: "Timeline",
                },
                contents: {
                  Timeline: {tweets: [{id_str: "old_1"}]},
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
          type: "SYSTEM_UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}]},
          meta: {name: "Timeline"},
          error: false,
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

  it("Search", () => {
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
              screen: {
                name: "Search",
              },
              contents: {
                Search: {tweets: [{id_str: "old_1"}], query: "くえりー"},
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
        type: "SYSTEM_UPDATE_TWEETS",
        payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}], query: "くえりー"},
        meta: {name: "Search"},
        error: false,
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).to.be.undefined;
        expect(effects.call).to.have.lengthOf(1);
      });
  });

  it("assign screen", () => {
    return expectSaga(reorder, {
      payload: {},
      meta: {force: false, screen: "Search"},
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
              screen: {
                name: "Timeline",
              },
              contents: {
                Search: {tweets: [], query: "くえりー"},
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
        type: "SYSTEM_UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {name: "Search"},
        error: false,
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
        type: "SELECT_CONTENT",
        payload: {name: "Search"},
        meta: null,
        error: false,
      })
      .put({
        type: "SYSTEM_UPDATE_TWEETS",
        payload: {tweets: [], query: "くえりー"},
        meta: {name: "Search"},
        error: false,
      })
      .put({
        type: "RELOAD",
        payload: null,
        meta: {force: true, screen: "Search"},
        error: false,
      })
      .put({
        type: "Search_STOP_TIMER",
      })
      .put({
        type: "Search_START_TIMER",
      })
      .run();
  });
});
