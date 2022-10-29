import {expectSaga} from "redux-saga-test-plan";
import {initialize, order} from "@source/renderer/sagas/metronome/search";
import {builders, fail} from "@test/helper";

describe("search", () => {
  describe("#initialize", () => {
    const identifier = "search";

    const preference = builders.preference.buildScreen({
      identifier: identifier,
    });

    it("when no cache", () => {
      return expectSaga(initialize, identifier, preference)
        .provide([
          {
            spawn(effect, next) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identifier, 60 * 1000]);
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
      const identifier = "search";

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
      const preference = builders.preference.buildScreen({
        identifier: identifier,
      });

      return expectSaga(order as SagaType, identifier, screen, preference, false)
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
              return;
            },
          },
        ])
        .put({
          type: `${identifier}_STOP_TIMER`,
        })
        .put({
          type: "screens/updateTweets",
          payload: {identifier, tweets: [new1, new2, old1], options: {query: "くえりー"}},
        })
        .put({
          type: `${identifier}_START_TIMER`,
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
        });
    });
    it("query is blank", () => {
      const identifier = "search";

      const screen = builders.state.buildScreen({
        tweets: [builders.twitter.buildTweet({id_str: "old_1"})],
        lastReadID: "0",
        options: {
          query: "",
        },
      });
      const preference = builders.preference.buildScreen({
        identifier: identifier,
      });

      return expectSaga(order as SagaType, identifier, screen, preference, false)
        .put({
          type: `${identifier}_STOP_TIMER`,
        })
        .put({
          type: "screens/setupSearch",
          payload: {identifier, query: ""},
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
