import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GATEKEEPER} from "@shared/defaults";

const facade = window.facade;

export const slice = createSlice({
  name: "gatekeeper",
  initialState: GATEKEEPER,
  reducers: {
    prepare: (state, action: PayloadAction<TMB.GatekeeperPreference>) => {
      return action.payload;
    },
    update: (state, action: PayloadAction<TMB.GatekeeperPreference>) => {
      const newState = action.payload;

      facade.storage.setGatekeeperPreference(newState);

      return newState;
    },
    addTaboo: (state, action: PayloadAction<{identifier: TMB.PassengerIdentifier; name: Twitter.ScreenName} & TMB.Taboo>) => {
      const {passengers} = state;
      const {identifier, name, keyword, expireAt} = action.payload;

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

      facade.storage.setGatekeeperPreference(state);

      return state;
    },
    deleteTaboo: (state, action: PayloadAction<{identifier: TMB.PassengerIdentifier; keyword: string}>) => {
      const {identifier, keyword} = action.payload;

      delete state.passengers[identifier].taboos[keyword];

      facade.storage.setGatekeeperPreference(state);

      return state;
    },
  },
});

export const {prepare, update, addTaboo, deleteTaboo} = slice.actions;
export default slice.reducer;
