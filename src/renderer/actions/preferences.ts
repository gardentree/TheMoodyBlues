import adapters from "@libraries/adapter";
import {createActions, handleActions, Action} from "redux-actions";

export const {updatePreferences} = createActions({
  UPDATE_PREFERENCES: (preferences: TMB.PreferenceMap) => preferences,
}) as {
  updatePreferences(preferences: TMB.PreferenceMap): Action<unknown>;
};

export default handleActions<TMB.PreferenceMap, TMB.PreferenceMap>(
  {
    [updatePreferences.toString()]: (state, action) => {
      return action.payload;
    },
  },
  adapters.preferences.getInitialState()
);
