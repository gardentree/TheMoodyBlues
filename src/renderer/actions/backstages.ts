import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";

export const slice = createSlice({
  name: "backstages",
  initialState: adapters.backstages.getInitialState(),
  reducers: {
    prepare: (state, action: PayloadAction<TMB.NormalizedBackstage>) => {
      return action.payload;
    },
  },
});

export const {prepare} = slice.actions;
export default slice.reducer;
