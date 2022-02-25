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

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenState} = createActions({
  UPDATE_TWEETS: [
    (tweets, identity, options = undefined) => ({
      tweets: tweets,
      ...options,
    }),
    (tweets, identity) => ({
      identity: identity,
    }),
  ],
  MARK: [
    (identity: TMB.ScreenID, lastReadID) => ({
      lastReadID: lastReadID,
    }),
    (identity: TMB.ScreenID, lastReadID) => ({
      identity: identity,
    }),
  ],
  SETUP_SEARCH: [
    (identity: string, query: string) => ({
      options: {
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
  PREPARE_SCREEN: [
    (identity: TMB.ScreenID) => {},
    (identity: TMB.ScreenID) => ({
      identity,
    }),
  ],
  CLOSE_SCREEN: [
    (identity: TMB.ScreenID) => {},
    (identity: TMB.ScreenID) => ({
      identity,
    }),
  ],
  UPDATE_SCREEN_STATE: [
    (identity: TMB.ScreenID, action: TMB.ScreenState) => ({
      state: {
        action,
        time: Date.now(),
      },
    }),
    (identity: TMB.ScreenID, action: TMB.ScreenState) => ({
      identity,
    }),
  ],
});

export default handleActions<TMB.ScreenMap, RecursivePartial<TMB.Screen>, {identity: TMB.ScreenID}>(
  {
    [updateTweets.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload);
    },
    [mark.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload);
    },
    [setupSearch.toString()]: (state, action) => {
      let query = action.payload.options!.query;
      if (query) {
        query = query.trim();
      } else {
        query = "";
      }

      return mergeScreen(state, action.meta.identity, {
        tweets: [],
        options: {
          query: query,
        },
      });
    },
    [changeMode.toString()]: (state, action) => {
      const {identity} = action.meta;

      return mergeScreen(state, identity, action.payload);
    },
    [prepareScreen.toString()]: (state, action) => {
      const {identity} = action.meta;
      const newState = new Map(state);

      newState.set(identity, INITIAL_VALUE);

      return newState;
    },
    [closeScreen.toString()]: (state, action) => {
      const {identity} = action.meta;
      const newState = new Map(state);

      newState.delete(identity);

      return newState;
    },
    [updateScreenState.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload);
    },
  },
  new Map()
);
