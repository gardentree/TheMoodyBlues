import {createActions, handleActions, Action} from "redux-actions";
import merge from "@libraries/merger";
import {INITIAL_VALUE} from "@libraries/screen";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeScreen(oldScreens: Map<string, TMB.Screen>, identity: TMB.ScreenID, newScreen: RecursivePartial<TMB.Screen>) {
  const screens = new Map(oldScreens);
  const screen = screens.get(identity)!;

  screens.set(identity, merge<TMB.Screen>(screen, newScreen as Partial<TMB.Screen>));

  return screens;
}

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} = createActions({
  UPDATE_TWEETS: [
    (identity, tweets, options = undefined) => {
      if (options) {
        return {
          tweets: tweets,
          options,
        };
      } else {
        return {
          tweets: tweets,
        };
      }
    },
    (identity, tweets) => ({
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
    (identity: TMB.ScreenID, query: string) => ({
      options: {
        query: query,
      },
    }),
    (identity: TMB.ScreenID, query: string) => ({
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
  UPDATE_SCREEN_STATUS: [
    (identity: TMB.ScreenID, status: string) => ({
      status: {
        status,
      },
    }),
    (identity: TMB.ScreenID, status: string) => ({
      identity,
    }),
  ],
}) as {
  updateTweets(identity: TMB.ScreenID, tweets: Twitter.Tweet[], options?: TMB.ScreenOptions): Action<unknown>;
  mark(identity: TMB.ScreenID, lastReadID: Twitter.TweetID): Action<unknown>;
  setupSearch(identity: TMB.ScreenID, query: string): Action<unknown>;
  changeMode(identity: TMB.ScreenID, mode: TMB.ArticleMode): Action<unknown>;
  prepareScreen(identity: TMB.ScreenID): Action<unknown>;
  closeScreen(identity: TMB.ScreenID): Action<unknown>;
  updateScreenStatus(identity: TMB.ScreenID, status: string): Action<unknown>;
};

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
    [updateScreenStatus.toString()]: (state, action) => {
      return mergeScreen(state, action.meta.identity, action.payload);
    },
  },
  new Map()
);
