import {expectSaga} from "redux-saga-test-plan";
import {initialize, order} from "../../../../src/renderer/sagas/metronome/timeline.ts";

describe("retrieveTimeline", () => {
  describe("#initialize", () => {
    it("when have cache", () => {
      const identity = "home";
      const title = "Home";

      const preference = {
        identity: identity,
        title: title,
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
      };

      return expectSaga(initialize, identity, preference)
        .provide([
          {
            call(effect: any, next: any) {
              return [{id_str: "1"}];
            },
          },
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identity, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identity, tweets: [{id_str: "1"}]},
        })
        .put({
          type: "screens/mark",
          payload: {identity, lastReadID: "1"},
        })
        .put({
          type: `${identity}_START_TIMER`,
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
      const identity = "home";
      const title = "Home";

      const preference = {
        identity: "home",
        title: title,
        component: "Timeline",
        interval: 120,
        way: "retrieveTimeline",
      };

      return expectSaga(initialize, identity, preference)
        .provide([
          {
            call(effect: any, next: any) {
              return [];
            },
          },
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).toBe("run");
              expect(effect.args).toEqual([identity, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identity, tweets: []},
        })
        .put({
          type: `${identity}_START_TIMER`,
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
      const identity = "home";
      const title = "Home";

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
      };
      const preference = {
        screen: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "retrieveTimeline",
        },
      };

      return expectSaga(order, identity, screen, preference, false)
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBe("old_1");
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).toBe(identity);
                  expect(effect.args[1]).toEqual([{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]);
                  return;
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identity, tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]},
        })
        .put({type: `${identity}_STOP_TIMER`})
        .put({type: `${identity}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(2);
        });
    });

    it("when force reload", () => {
      const identity = "home";
      const title = "Home";

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
      };
      const preference = {
        screen: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "retrieveTimeline",
        },
      };

      return expectSaga(order, identity, screen, preference, true)
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBeUndefined();
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).toBe(identity);
                  expect(effect.args[1]).toEqual([{id_str: "new_1"}, {id_str: "new_2"}]);
                  return;
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({
          type: "screens/updateTweets",
          payload: {identity, tweets: [{id_str: "new_1"}, {id_str: "new_2"}]},
        })
        .put({type: `${identity}_STOP_TIMER`})
        .put({type: `${identity}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(2);
        });
    });

    it("when no new tweets", () => {
      const identity = "home";
      const title = "Home";

      const screen = {
        tweets: [{id_str: "old_1"}],
        lastReadID: 0,
      };
      const preference = {
        screen: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "retrieveTimeline",
        },
      };

      return expectSaga(order, identity, screen, preference, false)
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "retrieveTimeline":
                  expect(effect.args[0]).toBe("old_1");
                  return [];
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({type: `${identity}_STOP_TIMER`})
        .put({type: `${identity}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).toBeUndefined();
          expect(effects.call).toHaveLength(1);
        });
    });
  });
});
