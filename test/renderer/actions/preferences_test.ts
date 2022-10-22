import reducer, {updatePreferences} from "@actions/preferences";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/preferences", () => {
  describe(updatePreferences.toString(), () => {
    it("when initialization", () => {
      const state = adapters.preferences.getInitialState();
      const preference = builders.buildPreference();
      const preferences = adapters.preferences.addMany(adapters.preferences.getInitialState(), [preference]);

      expect(reducer(state, updatePreferences(preferences))).toEqual(preferences);
    });
  });
});
