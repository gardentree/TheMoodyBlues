import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {rewires} from "../../../helper";
import MentionsSaga from "../../../../src/renderer/sagas/contents/mentions.ts";

const NAME = "Mentions";

const newTarget = (account, contents) => {
  const target = new MentionsSaga(account, contents);

  target.initialize = target.initialize.bind(target);
  target.order = target.order.bind(target);

  return target;
};

describe(MentionsSaga.name, () => {
  describe("#initialize", () => {
    it("when have cache", () => {
      const target = newTarget();

      return expectSaga(target.initialize, {payload: {tab: NAME}})
        .provide([
          {
            call(effect: any, next: any) {
              return [{id: 1}];
            },
          },
          {
            fork(effect: any, next: any) {
              expect(effect.fn.name).to.equal("runTimer");
              expect(effect.args).to.deep.equal([NAME, 60 * 1000]);
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id: 1}]},
          meta: {tab: NAME},
        })
        .put({
          type: "READ",
          payload: {lastReadID: 1},
        })
        .put({
          type: `${NAME}_STOP_TIMER`,
        })
        .put({
          type: `${NAME}_START_TIMER`,
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
      const target = newTarget();

      return expectSaga(target.initialize, {payload: {tab: NAME}})
        .provide([
          {
            call(effect: any, next: any) {
              return [];
            },
          },
          {
            fork(effect: any, next: any) {
              expect(effect.fn.name).to.equal("runTimer");
              expect(effect.args).to.deep.equal([NAME, 60 * 1000]);
            },
          },
        ])
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: []},
          meta: {tab: NAME},
        })
        .put({
          type: `${NAME}_STOP_TIMER`,
        })
        .put({
          type: `${NAME}_START_TIMER`,
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
      const target = newTarget(
        {
          mentionsTimeline: () => {},
        },
        {tweets: [{id_str: "old_1"}]}
      );

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
                case "mentionsTimeline":
                  expect(effect.args[0]).to.equal("old_1");
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.equal(NAME);
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
          meta: {tab: NAME},
        })
        .put({type: `${NAME}_STOP_TIMER`})
        .put({type: `${NAME}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
        });
    });

    it("when force reload", () => {
      const target = newTarget(
        {
          mentionsTimeline: () => {},
        },
        {tweets: [{id_str: "old_1"}]}
      );

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
                case "mentionsTimeline":
                  expect(effect.args[0]).to.equal(null);
                  return [{id_str: "new_1"}, {id_str: "new_2"}];
                case "setTweets":
                  expect(effect.args[0]).to.equal(NAME);
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
          meta: {tab: NAME},
        })
        .put({type: `${NAME}_STOP_TIMER`})
        .put({type: `${NAME}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(2);
        });
    });

    it("when no new tweets", () => {
      const target = newTarget(
        {
          mentionsTimeline: () => {},
        },
        {tweets: [{id_str: "old_1"}]}
      );

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
                case "mentionsTimeline":
                  expect(effect.args[0]).to.equal("old_1");
                  return [];
                default:
                  expect.fail(effect.fn.name);
                  return;
              }
            },
          },
        ])
        .put({type: `${NAME}_STOP_TIMER`})
        .put({type: `${NAME}_START_TIMER`})
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(1);
        });
    });
  });
});
