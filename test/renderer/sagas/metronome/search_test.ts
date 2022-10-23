import {expectSaga} from "redux-saga-test-plan";
import {initialize, order} from "@source/renderer/sagas/metronome/search";
import {builders, fail} from "@test/helper";

describe("search", () => {
  describe("#initialize", () => {
    const identity = "search";

    const preference = builders.state.buildScreenPreference({
      identity: identity,
    });

    it("when no cache", () => {
      return expectSaga(initialize, identity, preference)
        .provide([
          {
            spawn(effect, next) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identity, 60 * 1000]);
            },
          },
        ])
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toBeUndefined();
          expect(effects.fork).toHaveLength(1);
        });
    });
  });

  describe("#order", () => {
    it("normal", () => {
      const identity = "search";

      const old1 = builders.twitter.buildTweet({id_str: "old_1"});
      const new1 = builders.twitter.buildTweet({id_str: "new_1"});
      const new2 = builders.twitter.buildTweet({id_str: "new_2"});

      const screen = builders.state.buildScreen({
        tweets: [old1],
        lastReadID: "0",
        options: {
          query: "くえりー",
        },
      });
      const preference = builders.state.buildPreference({
        identity: identity,
      });

      return expectSaga(order as SagaType, identity, screen, preference, false)
        .provide([
          {
            call(effect, next) {
              switch (effect.fn.name) {
                case "search":
                  expect(effect.args[0]).toBe("くえりー");
                  expect(effect.args[1]).toBe("old_1");
                  return [new1, new2];
                default:
                  fail(effect.fn.name);
              }
            },
          },
        ])
        .put({
          type: `${identity}_STOP_TIMER`,
        })
        .put({
          type: "screens/updateTweets",
          payload: {identity, tweets: [new1, new2, old1], options: {query: "くえりー"}},
        })
        .put({
          type: `${identity}_START_TIMER`,
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
        });
    });
    it("query is blank", () => {
      const identity = "search";

      const screen = builders.state.buildScreen({
        tweets: [builders.twitter.buildTweet({id_str: "old_1"})],
        lastReadID: "0",
        options: {
          query: "",
        },
      });
      const preference = builders.state.buildPreference({
        identity: identity,
      });

      return expectSaga(order as SagaType, identity, screen, preference, false)
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

          expect(effects.put).toBeUndefined();
          expect(effects.call).toBeUndefined();
        });
    });
  });
});
