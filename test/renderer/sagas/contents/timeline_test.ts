import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import TimelineSaga from "../../../../src/renderer/sagas/contents/timeline.ts";

const newTarget = (tweets: TweetType[], timeline: TheMoodyBlues.Store.Timeline) => {
  const agent = {
    [timeline.preference.way]: () => tweets,
  };

  const target = new TimelineSaga(agent, timeline);

  target.initialize = target.initialize.bind(target);
  target.order = target.order.bind(target);

  return target;
};

describe(TimelineSaga.name, () => {
  describe("#initialize", () => {
    it("when have cache", () => {
      const identity = "home";
      const title = "Home";

      const target = newTarget([], {
        preference: {
          identity: identity,
          title: title,
          component: "Timeline",
          interval: 120,
          way: "timeline",
        },
        tweets: [],
        state: {
          lastReadID: 0,
        },
      });

      return expectSaga(target.initialize, {payload: {identity: identity}})
        .provide([
          {
            call(effect: any, next: any) {
              return [{id: 1}];
            },
          },
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).to.equal("runTimer");
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
          type: "READ",
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

      const target = newTarget([], {
        preference: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "timeline",
        },
        tweets: [],
        state: {
          lastReadID: 0,
        },
      });

      return expectSaga(target.initialize, {payload: {identity: identity}})
        .provide([
          {
            call(effect: any, next: any) {
              return [];
            },
          },
          {
            spawn(effect: any, next: any) {
              expect(effect.fn.name).to.equal("runTimer");
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

      const target = newTarget([], {
        preference: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "timeline",
        },
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
        },
      });

      return expectSaga(target.order, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "timeline":
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

      const target = newTarget([], {
        preference: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "timeline",
        },
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
        },
      });

      return expectSaga(target.order, {
        payload: {},
        meta: {
          force: true,
        },
      })
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "timeline":
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

      const target = newTarget([], {
        preference: {
          identity: "home",
          title: title,
          component: "Timeline",
          interval: 120,
          way: "timeline",
        },
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
        },
      });

      return expectSaga(target.order, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .provide([
          {
            call(effect: any, next: any) {
              switch (effect.fn.name) {
                case "timeline":
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
