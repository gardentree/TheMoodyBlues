import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GATEKEEPER} from "@shared/defaults";

const facade = window.facade;

export const slice = createSlice({
  name: "gatekeeper",
  initialState: GATEKEEPER,
  reducers: {
    prepare: (state, action: PayloadAction<TMB.Gatekeeper>) => {
      return action.payload;
    },
    update: (state, action: PayloadAction<TMB.Gatekeeper>) => {
      const newState = action.payload;

      facade.storage.setGatekeeper(newState);

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

      facade.storage.setGatekeeper(state);

      return state;
    },
    deleteTaboo: (state, action: PayloadAction<{identifier: TMB.PassengerIdentifier; keyword: string}>) => {
      const {identifier, keyword} = action.payload;

      delete state.passengers[identifier].taboos[keyword];

      facade.storage.setGatekeeper(state);

      return state;
    },
  },
});

export const {prepare, update, addTaboo, deleteTaboo} = slice.actions;
export default slice.reducer;
