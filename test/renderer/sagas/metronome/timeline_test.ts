import {expectSaga} from "redux-saga-test-plan";
import {initialize, order} from "@source/renderer/sagas/metronome/timeline";
import {builders, fail} from "@test/helper";

describe("retrieveTimeline", () => {
  describe("#initialize", () => {
    it("when have cache", () => {
      const identifier = "home";

      const preference = builders.preference.buildScreen({
        identifier: identifier,
      });

      return expectSaga(initialize as SagaType, identifier, preference)
        .provide([
          {
            call(effect) {
              return [{id_str: "1"}];
            },
          },
          {
            spawn(effect, next) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identifier, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identifier, tweets: [{id_str: "1"}]},
        })
        .put({
          type: "screens/mark",
          payload: {identifier, lastReadID: "1"},
        })
        .put({
          type: `${identifier}_START_TIMER`,
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
          expect(effects.fork).toHaveLength(1);
        });
    });
    it("when no cache", () => {
      const identifier = "home";
      const title = "Home";

      const preference = {
        identifier: "home",
        title: title,
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
      };

      return expectSaga(initialize as SagaType, identifier, preference)
        .provide([
          {
            call(effect, next) {
              return [];
            },
          },
          {
            spawn(effect, next) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identifier, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identifier, tweets: []},
        })
        .put({
          type: `${identifier}_START_TIMER`,
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
          expect(effects.fork).toHaveLength(1);
        });
    });
  });

  describe("#order", () => {
    it("when reload", () => {
      const identifier = "home";

      const old1 = builders.twitter.buildTweet({id_str: "old_1"});
      const new1 = builders.twitter.buildTweet({id_str: "new_1"});
      const new2 = builders.twitter.buildTweet({id_str: "new_2"});

      const screen = builders.state.buildScreen({
        tweets: [old1],
        lastReadID: "0",
      });
      const preference = builders.preference.buildScreen({
        identifier: "home",
      });
      const gatekeeper = builders.preference.buildGatekeeper();

      return expectSaga(order as SagaType, identifier, screen, preference, gatekeeper, false)
        .provide([
          {
            call(effect, next) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBe("old_1");
                  return [new1, new2];
                case "setTweets":
                  expect(effect.args[0]).toBe(identifier);
                  expect(effect.args[1]).toEqual([new1, new2, old1]);
                  return;
                default:
                  fail(effect.fn.name);
              }
              return;
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identifier, tweets: [new1, new2, old1]},
        })
        .put({type: `${identifier}_STOP_TIMER`})
        .put({type: `${identifier}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(2);
        });
    });

    it("when force reload", () => {
      const identifier = "home";
      const title = "Home";

      const old1 = builders.twitter.buildTweet({id_str: "old_1"});
      const new1 = builders.twitter.buildTweet({id_str: "new_1"});
      const new2 = builders.twitter.buildTweet({id_str: "new_2"});

      const screen = {
        tweets: [old1],
        lastReadID: 0,
      };
      const preference = {
        identifier: "home",
        title: title,
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
      };
      const gatekeeper = builders.preference.buildGatekeeper();

      return expectSaga(order as SagaType, identifier, screen, preference, gatekeeper, true)
        .provide([
          {
            call(effect, next) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBeUndefined();
                  return [new1, new2];
                case "setTweets":
                  expect(effect.args[0]).toBe(identifier);
                  expect(effect.args[1]).toEqual([new1, new2]);
                  return;
                default:
                  fail(effect.fn.name);
              }

              return;
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identifier, tweets: [new1, new2]},
        })
        .put({type: `${identifier}_STOP_TIMER`})
        .put({type: `${identifier}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(2);
        });
    });

    it("when no new tweets", () => {
      const identifier = "home";
      const title = "Home";

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
      };
      const preference = {
        identifier: "home",
        title: title,
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
      };

      return expectSaga(order as SagaType, identifier, screen, preference, false)
        .provide([
          {
            call(effect, next) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBe("old_1");
                  return [];
                default:
                  fail(effect.fn.name);
              }
              return;
            },
          },
        ])
        .put({type: `${identifier}_STOP_TIMER`})
        .put({type: `${identifier}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
        });
    });
  });
});
