import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {initialize, order} from "../../../../src/renderer/sagas/metronome/search.ts";

describe("search", () => {
  describe("#initialize", () => {
    const identity = "search";
    const title = identity;

    const preference = {
      identity: identity,
      title: title,
      component: identity,
      interval: 60,
      way: "search",
    };

    it("when no cache", () => {
      return expectSaga(initialize, identity, preference)
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.be.undefined;
          expect(effects.fork).to.have.lengthOf(1);
        });
    });
  });

  describe("#order", () => {
    it("normal", () => {
      const identity = "search";
      const title = identity;

      const timeline = {
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
          query: "くえりー",
        },
      };
      const preference = {
        timeline: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
      };

      return expectSaga(order, identity, timeline, preference, false)
        .provide([
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
          type: `${identity}_STOP_TIMER`,
        })
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}], query: "くえりー"},
          meta: {identity: identity},
        })
        .put({
          type: `${identity}_START_TIMER`,
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(1);
        });
    });
    it("query is blank", () => {
      const identity = "search";
      const title = identity;

      const timeline = {
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
          query: "",
        },
      };
      const preference = {
        timeline: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
      };

      return expectSaga(order, identity, timeline, preference, false)
        .put({
          type: `${identity}_STOP_TIMER`,
        })
        .put({
          type: "SETUP_SEARCH",
          payload: {state: {query: ""}},
          meta: {identity: identity},
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.be.undefined;
        });
    });
  });
});
