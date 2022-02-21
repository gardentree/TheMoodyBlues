import {createActions, handleActions} from "redux-actions";

export const {updatePreference} = createActions({
  UPDATE_PREFERENCE: (preferences: TheMoodyBlues.PreferenceMap) => preferences,
});

export default handleActions<TheMoodyBlues.PreferenceMap, TheMoodyBlues.PreferenceMap>(
  {
    [updatePreference.toString()]: (state, action) => {
      return action.payload;
    },
  },
  new Map()
);
