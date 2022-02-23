import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
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
              return [{id: 1}];
            },
          },
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).to.equal("run");
              expect(effect.args).to.deep.equal([identity, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id: 1}]},
          meta: {identity: identity},
        })
        .put({
          type: "MARK",
          payload: {lastReadID: 1},
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
          expect(effects.fork).to.have.lengthOf(1);
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
              expect(effect.fn.name).to.equal("run");
              expect(effect.args).to.deep.equal([identity, 120 * 1000]);
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: []},
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
          expect(effects.fork).to.have.lengthOf(1);
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
                  expect(effect.args[0]).to.equal("old_1");
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.equal(identity);
                  expect(effect.args[1]).to.deep.equal([{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}]);
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
          meta: {identity: identity},
        })
        .put({type: `${identity}_STOP_TIMER`})
        .put({type: `${identity}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
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
                  expect(effect.args[0]).to.equal(null);
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.equal(identity);
                  expect(effect.args[1]).to.deep.equal([{id_str: "new_1"}, {id_str: "new_2"}]);
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
          meta: {identity: identity},
        })
        .put({type: `${identity}_STOP_TIMER`})
        .put({type: `${identity}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
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
                  expect(effect.args[0]).to.equal("old_1");
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

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(1);
        });
    });
  });
});
