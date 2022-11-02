import {expectSaga} from "redux-saga-test-plan";
import {prepareState} from "@source/renderer/sagas/preference";
import adapters from "@source/renderer/libraries/adapter";
import {builders, fail} from "@test/helper";

import rootReducer from "@source/renderer/actions/reducer";

describe(prepareState.name, () => {
  it("reload", () => {
    const backstages: TMB.NormalizedBackstage = adapters.backstages.addMany(adapters.backstages.getInitialState(), [builders.preference.buildBackstage({identifier: "home"})]);
    const gatekeeper: TMB.Gatekeeper = builders.preference.buildGatekeeper();

    return expectSaga(prepareState as SagaType, {
      type: "",
      payload: undefined,
    })
      .withReducer(rootReducer)
      .provide([
        {
          call(effect, next) {
            switch (effect.fn.name) {
              case "loadBackstages":
                return backstages;
              case "getGatekeeper":
                return gatekeeper;
              default:
                fail(effect.fn.name);
            }
            return;
          },
        },
      ])
      .run()
      .then((result) => {
        const {storeState} = result;

        const state: TMB.State = {
          principal: {
            dialog: null,
            focused: "",
            nowLoading: false,
            screens: ["home"],
            style: {
              fontSize: "12px",
            },
          },
          screens: {
            ids: ["home"],
            entities: {
              home: {
                identifier: "home",
                lastReadID: "",
                mode: "tweet",
                status: {
                  status: "",
                },
                tweets: [],
              },
            },
          },
          backstages: {
            ids: ["home"],
            entities: {
              home: {
                active: true,
                component: "Timeline",
                growl: false,
                identifier: "home",
                interval: 120,
                mute: true,
                title: "Home",
                way: "retrieveTimeline",
              },
            },
          },
          lineage: {
            entities: {},
            ids: [],
          },
          gatekeeper: gatekeeper,
          form: {},
        };

        expect(storeState).toEqual(state);
      });
  });
});
