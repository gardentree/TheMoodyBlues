import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";
import {INITIAL_VALUE} from "@libraries/screen";

type PartialScreen = Pick<TMB.Screen, "identifier"> & Partial<TMB.Screen>;

function mergeScreen(state: TMB.ScreenMap, screen: PartialScreen) {
  return adapters.screens.updateOne(state, {id: screen.identifier, changes: screen});
}

export const slice = createSlice({
  name: "screens",
  initialState: adapters.screens.getInitialState(),
  reducers: {
    updateTweets: (state, action: PayloadAction<{identifier: TMB.ScreenID; tweets: Twitter.Tweet[]; options?: TMB.ScreenOptions}>) => {
      return mergeScreen(state, action.payload);
    },
    mark: (state, action: PayloadAction<{identifier: TMB.ScreenID; lastReadID: Twitter.TweetID}>) => {
      return mergeScreen(state, action.payload);
    },
    setupSearch: (state, action: PayloadAction<{identifier: TMB.ScreenID; query: string}>) => {
      const {identifier, query} = action.payload;

      return mergeScreen(state, {identifier, options: {query: query.trim()}});
    },
    changeMode: (state, action: PayloadAction<{identifier: TMB.ScreenID; mode: TMB.ArticleMode}>) => {
      return mergeScreen(state, action.payload);
    },
    prepareScreen: (state, action: PayloadAction<TMB.ScreenID>) => {
      return adapters.screens.addOne(state, Object.assign({}, INITIAL_VALUE, {identifier: action.payload}));
    },
    closeScreen: (state, action: PayloadAction<TMB.ScreenID>) => {
      return adapters.screens.removeOne(state, action.payload);
    },
    updateScreenStatus: (state, action: PayloadAction<{identifier: TMB.ScreenID; status: string}>) => {
      return mergeScreen(state, {identifier: action.payload.identifier, status: {status: action.payload.status}});
    },
  },
});

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} = slice.actions;
export default slice.reducer;
