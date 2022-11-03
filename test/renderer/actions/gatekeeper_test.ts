import reducer, {addTaboo, deleteTaboo} from "@actions/gatekeeper";
import {builders, convertRecord} from "@test/helper";

const {facade} = window;

describe("@actions/gatekeeper", () => {
  describe(addTaboo, () => {
    it("as usual", () => {
      const spy = jest.spyOn(facade.storage, "setGatekeeper");

      const taboo = builders.preference.buildTaboo();
      const passenger = builders.preference.buildPassenger([taboo]);

      const {identifier, name} = passenger;
      const {keyword, expireAt} = taboo;

      const expected = {
        checkedAt: 0,
        passengers: {
          [identifier]: {
            identifier,
            name,
            taboos: {
              [taboo.keyword]: taboo,
            },
          },
        },
      };

      expect(
        reducer(
          {
            checkedAt: 0,
            passengers: {},
          },
          addTaboo({identifier, name, keyword, expireAt})
        )
      ).toEqual(expected);
      expect(spy).toBeCalledWith(expected);
    });
  });
  describe(deleteTaboo, () => {
    it("as usual", () => {
      const spy = jest.spyOn(facade.storage, "setGatekeeper");

      const taboo1 = builders.preference.buildTaboo();
      const taboo2 = builders.preference.buildTaboo();
      const passenger = builders.preference.buildPassenger([taboo1, taboo2]);

      const {identifier, name} = passenger;

      const expected = {
        checkedAt: 0,
        passengers: {
          [identifier]: {
            identifier,
            name,
            taboos: {
              [taboo2.keyword]: taboo2,
            },
          },
        },
      };

      expect(
        reducer(
          {
            checkedAt: 0,
            passengers: convertRecord([passenger], "identifier"),
          },
          deleteTaboo({identifier, keyword: taboo1.keyword})
        )
      ).toEqual(expected);
      expect(spy).toBeCalledWith(expected);
    });
  });
});
