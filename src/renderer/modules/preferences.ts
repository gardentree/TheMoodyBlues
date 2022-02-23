import {createActions, handleActions} from "redux-actions";

export const {updatePreferences} = createActions({
  UPDATE_PREFERENCES: (preferences: TMB.PreferenceMap) => preferences,
});

export default handleActions<TMB.PreferenceMap, TMB.PreferenceMap>(
  {
    [updatePreferences.toString()]: (state, action) => {
      return action.payload;
    },
  },
  new Map()
);
