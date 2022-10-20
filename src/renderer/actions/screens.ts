import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import adapters from "@libraries/adapter";
import {INITIAL_VALUE} from "@libraries/screen";

type PartialScreen = Pick<TMB.Screen, "identity"> & Partial<TMB.Screen>;

function mergeScreen(state: TMB.ScreenMap, screen: PartialScreen) {
  return adapters.screens.updateOne(state, {id: screen.identity, changes: screen});
}

export const slice = createSlice({
  name: "screens",
  initialState: adapters.screens.getInitialState(),
  reducers: {
    updateTweets: (state, action: PayloadAction<{identity: TMB.ScreenID; tweets: Twitter.Tweet[]; options?: TMB.ScreenOptions}>) => {
      return mergeScreen(state, action.payload);
    },
    mark: (state, action: PayloadAction<{identity: TMB.ScreenID; lastReadID: Twitter.TweetID}>) => {
      return mergeScreen(state, action.payload);
    },
    setupSearch: (state, action: PayloadAction<{identity: TMB.ScreenID; query: string}>) => {
      const {identity, query} = action.payload;

      return mergeScreen(state, {identity, options: {query: query.trim()}});
    },
    changeMode: (state, action: PayloadAction<{identity: TMB.ScreenID; mode: TMB.ArticleMode}>) => {
      return mergeScreen(state, action.payload);
    },
    prepareScreen: (state, action: PayloadAction<TMB.ScreenID>) => {
      return adapters.screens.addOne(state, Object.assign({}, INITIAL_VALUE, {identity: action.payload}));
    },
    closeScreen: (state, action: PayloadAction<TMB.ScreenID>) => {
      return adapters.screens.removeOne(state, action.payload);
    },
    updateScreenStatus: (state, action: PayloadAction<{identity: TMB.ScreenID; status: string}>) => {
      return mergeScreen(state, {identity: action.payload.identity, status: {status: action.payload.status}});
    },
  },
});

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} = slice.actions;
export default slice.reducer;
