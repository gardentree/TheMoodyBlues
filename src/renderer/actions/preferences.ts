import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";

export const slice = createSlice({
  name: "preferences",
  initialState: adapters.preferences.getInitialState(),
  reducers: {
    updatePreferences: (state, action: PayloadAction<TMB.PreferenceMap>) => {
      return action.payload;
    },
  },
});

export const {updatePreferences} = slice.actions;
export default slice.reducer;
