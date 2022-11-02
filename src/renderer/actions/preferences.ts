import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";

export const slice = createSlice({
  name: "preferences",
  initialState: adapters.preferences.getInitialState(),
  reducers: {
    prepare: (state, action: PayloadAction<TMB.NormalizedScreenPreference>) => {
      return action.payload;
    },
  },
});

export const {prepare} = slice.actions;
export default slice.reducer;
