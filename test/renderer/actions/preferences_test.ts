import reducer, {prepare} from "@actions/preferences";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/preferences", () => {
  describe(prepare, () => {
    it("when initialization", () => {
      const state = adapters.preferences.getInitialState();
      const preference = builders.preference.buildScreen();
      const preferences = adapters.preferences.addMany(adapters.preferences.getInitialState(), [preference]);

      expect(reducer(state, prepare(preferences))).toEqual(preferences);
    });
  });
});
