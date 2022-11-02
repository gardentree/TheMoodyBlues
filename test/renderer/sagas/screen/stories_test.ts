import {checkGatekeeper, reorder} from "@source/renderer/sagas/screen/stories";
import adapters from "@source/renderer/libraries/adapter";
import {builders, convertRecord, fail} from "@test/helper";
import {EVERYONE, GATEKEEPER} from "@source/shared/defaults";
import {expectSaga} from "redux-saga-test-plan";

const facade = window.facade;

describe(reorder.name, () => {
  it("when valid", () => {
    const now = Date.now();
    const home = builders.state.buildScreen({identifier: "home"});
    const screens = adapters.screens.addOne(adapters.screens.getInitialState(), home);

    const preference = builders.preference.buildScreen({identifier: home.identifier});
    const preferences = adapters.preferences.addOne(adapters.preferences.getInitialState(), preference);

    const indefinite = builders.preference.buildTaboo({keyword: "indefinite", expireAt: 0});
    const valid = builders.preference.buildTaboo({keyword: "valid", expireAt: now + 1000 * 60 * 30});
    const expired = builders.preference.buildTaboo({keyword: "expired", expireAt: now - 1000 * 60 * 30});

    const passenger = builders.preference.buildPassenger([indefinite, valid, expired]);
    const gatekeeper = builders.preference.buildGatekeeper({passengers: {[passenger.identifier]: passenger}, checkedAt: now - 1000 * 60 * 10});

    return expectSaga(reorder, {
      type: "",
      payload: {identifier: home.identifier},
      meta: {force: false},
    })
      .provide([
        {
          select() {
            return {
              screens: screens,
              preferences: preferences,
              principal: {
                focused: preference.component,
              },
              gatekeeper: gatekeeper,
            };
          },
        },
        {
          call(effect, next) {
            switch (effect.fn.name) {
              case "retrieveTimeline":
                return [];
              default:
                fail(effect.fn.name);
            }
            return;
          },
        },
      ])
      .put({
        type: "home_STOP_TIMER",
      })
      .put({
        type: "home_START_TIMER",
      })
      .run()
      .then((result) => {
        const {effects} = result;

        expect(effects.put).toHaveLength(1);
        const actual = effects.put[0].payload.action.payload;
        expect(actual.passengers).toEqual({[passenger.identifier]: builders.preference.buildPassenger([indefinite, valid])});
        expect(actual.checkedAt).toBeGreaterThan(now);

        expect(effects.call).toHaveLength(1);
      });
  });
});

describe(checkGatekeeper.name, () => {
  it("when valid", () => {
    const spy = jest.spyOn(facade.storage, "setGatekeeperPreference");
    const gatekeeper = builders.preference.buildGatekeeper({checkedAt: Date.now()});

    expect(checkGatekeeper(gatekeeper)).toEqual(gatekeeper);
    expect(spy).not.toBeCalled();
  });
  it("when expired", () => {
    const spy = jest.spyOn(facade.storage, "setGatekeeperPreference");

    const now = Date.now();
    jest.useFakeTimers().setSystemTime(now);

    const gatekeeper = builders.preference.buildGatekeeper({checkedAt: now - 1000 * 60 * 10});

    expect(checkGatekeeper(gatekeeper)).toEqual(Object.assign({}, gatekeeper, {checkedAt: now}));
    expect(spy).not.toBeCalled();
  });

  it("when expired", () => {
    const spy = jest.spyOn(facade.storage, "setGatekeeperPreference");

    const now = Date.now();
    jest.useFakeTimers().setSystemTime(now);

    const indefinite = builders.preference.buildTaboo({keyword: "indefinite", expireAt: 0});
    const valid = builders.preference.buildTaboo({keyword: "valid", expireAt: now + 1000 * 60 * 30});
    const expired = builders.preference.buildTaboo({keyword: "expired", expireAt: now - 1000 * 60 * 30});

    const passenger = builders.preference.buildPassenger([indefinite, valid, expired]);
    const gatekeeper = builders.preference.buildGatekeeper({passengers: {[passenger.identifier]: passenger}, checkedAt: now - 1000 * 60 * 10});

    const expected = {
      passengers: {
        [passenger.identifier]: Object.assign({}, passenger, {taboos: convertRecord([indefinite, valid], "keyword")}),
      },
      checkedAt: now,
    };

    expect(checkGatekeeper(gatekeeper)).toEqual(expected);
    expect(spy).not.toBeCalled();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
});
