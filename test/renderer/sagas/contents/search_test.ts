import {expectSaga} from "redux-saga-test-plan";
import {expect} from "chai";
import {rewires} from "../../../helper";
import SearchSaga from "../../../../src/renderer/sagas/contents/search.ts";

const NAME = "Search";

const newTarget = (account, contents) => {
  const target = new SearchSaga(account, contents);

  target.initialize = target.initialize.bind(target);
  target.order = target.order.bind(target);

  return target;
};

describe(SearchSaga.name, () => {
  describe("#initialize", () => {
    it("when no cache", () => {
      const target = new SearchSaga();
      target.initialize = target.initialize.bind(target);

      return expectSaga(target.initialize, {payload: {tab: NAME}})
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
      const target = newTarget(
        {
          search: () => {
            return [{id_str: "1"}];
          },
        },
        {tweets: [{id_str: "old_1"}], query: "くえりー"}
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
          type: "Search_STOP_TIMER",
        })
        .put({
          type: "UPDATE_TWEETS",
          payload: {tweets: [{id_str: "new_1"}, {id_str: "new_2"}, {id_str: "old_1"}], query: "くえりー"},
          meta: {tab: "Search"},
        })
        .put({
          type: "Search_START_TIMER",
        })
        .run()
        .then((result) => {
          const {effects} = result;

          expect(effects.put).to.be.undefined;
          expect(effects.call).to.have.lengthOf(1);
        });
    });
    it("query is blank", () => {
      const target = newTarget(
        {
          search: () => {
            return [{id_str: "1"}];
          },
        },
        {tweets: [{id_str: "old_1"}], query: ""}
      );

      return expectSaga(target.order, {
        payload: {},
        meta: {
          force: false,
        },
      })
        .put({
          type: "Search_STOP_TIMER",
        })
        .put({
          type: "SETUP_SEARCH",
          payload: {query: ""},
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
