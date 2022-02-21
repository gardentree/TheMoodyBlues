import {createActions, handleActions} from "redux-actions";
import merge from "@libraries/merger";
import {INITIAL_VALUE} from "@libraries/screen";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeScreen(oldScreens: Map<string, TMB.Screen>, identity: string, newScreen: RecursivePartial<TMB.Screen>) {
  const screens = new Map(oldScreens);
  const screen = screens.get(identity)!;

  screens.set(identity, merge<TMB.Screen>(screen, newScreen as Partial<TMB.Screen>));

  return screens;
}

export const {updateTweets, read, setupSearch, changeMode, open, close} = createActions({
  UPDATE_TWEETS: [
    (tweets, identity, options = undefined) => ({
      tweets: tweets,
      ...options,
    }),
    (tweets, identity) => ({
      identity: identity,
    }),
  ],
  READ: [
    (identity: TMB.ScreenID, lastReadID) => ({
      state: {
        lastReadID: lastReadID,
      },
    }),
    (identity: TMB.ScreenID, lastReadID) => ({
      identity: identity,
    }),
  ],
  SETUP_SEARCH: [
    (identity: string, query: string) => ({
      state: {
        query: query,
      },
    }),
    (identity: string, query: string) => ({
      identity: identity,
    }),
  ],
  CHANGE_MODE: [
    (identity: TMB.ScreenID, mode: TMB.ArticleMode) => ({mode}),
    (identity: TMB.ScreenID, mode: TMB.ArticleMode) => ({
      identity,
    }),
  ],
  OPEN: [
    (identity: TMB.ScreenID) => {},
    (identity: TMB.ScreenID) => ({
      identity,
    }),
  ],
  CLOSE: [
    (identity: TMB.ScreenID) => {},
    (identity: TMB.ScreenID) => ({
      identity,
    }),
  ],
});

export default handleActions<TMB.ScreenMap, RecursivePartial<TMB.Screen>, {identity: TMB.ScreenID}>(
  {
    [updateTweets.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload as RecursivePartial<TMB.Screen>);
    },
    [read.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload as RecursivePartial<TMB.Screen>);
    },
    [setupSearch.toString()]: (state, action) => {
      let query = (action.payload as RecursivePartial<TMB.Screen>).state!.query;
      if (query) {
        query = query.trim();
      } else {
        query = "";
      }

      return mergeScreen(state, action.meta.identity, {
        tweets: [],
        state: {
          query: query,
        },
      });
    },
    [changeMode.toString()]: (state, action) => {
      const {identity} = action.meta;

      return mergeScreen(state, identity, action.payload as RecursivePartial<TMB.Screen>);
    },
    [open.toString()]: (state, action) => {
      const {identity} = action.meta;
      const newState = new Map(state);

      newState.set(identity, INITIAL_VALUE);

      return newState;
    },
    [close.toString()]: (state, action) => {
      const {identity} = action.meta;
      const newState = new Map(state);

      newState.delete(identity);

      return newState;
    },
  },
  new Map()
);
