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
        .provide([
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).to.equal("run");
              expect(effect.args).to.deep.equal([identity, 60 * 1000]);
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

  describe("#order", () => {
    it("normal", () => {
      const identity = "search";
      const title = identity;

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
        options: {
          query: "くえりー",
        },
      };
      const preference = {
        screen: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
      };

      return expectSaga(order, identity, screen, preference, false)
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
          type: "screens/updateTweets",
          payload: {identity, tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}], options: {query: "くえりー"}},
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

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
        options: {
          query: "",
        },
      };
      const preference = {
        screen: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
      };

      return expectSaga(order, identity, screen, preference, false)
        .put({
          type: `${identity}_STOP_TIMER`,
        })
        .put({
          type: "screens/setupSearch",
          payload: {identity, query: ""},
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
