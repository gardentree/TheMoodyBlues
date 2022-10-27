import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GATEKEEPER} from "@shared/defaults";

const facade = window.facade;

export const slice = createSlice({
  name: "gatekeeper",
  initialState: GATEKEEPER,
  reducers: {
    update: (state, action: PayloadAction<TMB.GatekeeperPreference>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTaboo.fulfilled, (state, action: PayloadAction<TMB.GatekeeperPreference>) => {
      return action.payload;
    });
  },
});
export const addTaboo = createAsyncThunk("gatekeeper/addTaboo", async (action: {identifier: TMB.PassengerIdentifier; name: Twitter.ScreenName} & TMB.Taboo) => {
  const {identifier, name, keyword, expireAt} = action;

  const preference = await facade.storage.getGatekeeperPreference();
  const {passengers} = preference;

  if (passengers[identifier]) {
    passengers[identifier].taboos[keyword] = {keyword, expireAt};
  } else {
    Object.assign(passengers, {
      [identifier]: {
        identifier,
        name,
        taboos: {[keyword]: {keyword, expireAt}},
      },
    });
  }

  facade.storage.setGatekeeperPreference(preference);

  return preference;
});

export const {update} = slice.actions;
export default slice.reducer;
