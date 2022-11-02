import reducer, {prepare} from "@actions/backstages";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/backstages", () => {
  describe(prepare, () => {
    it("when initialization", () => {
      const state = adapters.backstages.getInitialState();
      const preference = builders.preference.buildBackstage();
      const backstages = adapters.backstages.addMany(adapters.backstages.getInitialState(), [preference]);

      expect(reducer(state, prepare(backstages))).toEqual(backstages);
    });
  });
});
