import {createActions, handleActions} from "redux-actions";

export const {updatePreference} = createActions({
  UPDATE_PREFERENCE: (preferences: TMB.PreferenceMap) => preferences,
});

export default handleActions<TMB.PreferenceMap, TMB.PreferenceMap>(
  {
    [updatePreference.toString()]: (state, action) => {
      return action.payload;
    },
  },
  new Map()
);
