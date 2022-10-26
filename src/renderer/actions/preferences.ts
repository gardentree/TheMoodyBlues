import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";

const facade = window.facade;

export const slice = createSlice({
  name: "preferences",
  initialState: adapters.preferences.getInitialState(),
  reducers: {
    updatePreferences: (state, action: PayloadAction<TMB.PreferenceMap>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTaboo.fulfilled, (state, action: PayloadAction<TMB.MutePreference>) => {
      const mute = action.payload;
      for (const preference of adapters.preferences.getSelectors().selectAll(state)) {
        adapters.preferences.updateOne(state, {id: preference.identifier, changes: {mute: mute}});
      }
    });
  },
});
export const addTaboo = createAsyncThunk("preferences/addTaboo", async (action: {identifier: TMB.PassengerIdentifier; name: Twitter.ScreenName} & TMB.Taboo) => {
  const {identifier, name, keyword, expireAt} = action;

  const preference = await facade.storage.getMutePreference();

  if (preference[identifier]) {
    preference[identifier].taboos[keyword] = {keyword, expireAt};
  } else {
    Object.assign(preference, {
      [identifier]: {
        identifier,
        name,
        taboos: {[keyword]: {keyword, expireAt}},
        withMedia: false,
        retweetYourself: false,
        retweetReaction: false,
      },
    });
  }

  facade.storage.setMutePreference(preference);

  return preference;
});

export const {updatePreferences} = slice.actions;
export default slice.reducer;
