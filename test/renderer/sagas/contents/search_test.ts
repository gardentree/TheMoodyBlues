import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import SearchSaga from "../../../../src/renderer/sagas/contents/search.ts";

const newTarget = (tweets: TweetType[], timeline: TheMoodyBlues.Timeline) => {
  const account = {
    [timeline.meta.way]: () => tweets,
  };

  const target = new SearchSaga(account, timeline);

  target.initialize = target.initialize.bind(target);
  target.order = target.order.bind(target);

  return target;
};

describe(SearchSaga.name, () => {
  describe("#initialize", () => {
    const identity = "search";
    const title = identity;

    const target = newTarget([], {
      meta: {
        identity: identity,
        title: title,
        component: identity,
        interval: 60,
        way: "search",
      },
      tweets: [],
      state: {
        lastReadID: 0,
      },
    });

    it("when no cache", () => {
      return expectSaga(target.initialize, {payload: {identity: identity}})
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

      const target = newTarget([{id_str: "1"}], {
        meta: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
          query: "くえりー",
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

      const target = newTarget([{id_str: "1"}], {
        meta: {
          identity: identity,
          title: title,
          component: identity,
          interval: 60,
          way: "search",
        },
        tweets: [{id_str: "old_1"}],
        state: {
          lastReadID: 0,
          query: "",
        },
      });

      return expectSaga(target.order, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .put({
          type: `${identity}_STOP_TIMER`,
        })
        .put({
          type: "SETUP_SEARCH",
          payload: {query: ""},
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
