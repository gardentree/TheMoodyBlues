import {createActions, handleActions} from "redux-actions";
import merge from "@libraries/merger";
import {INITIAL_VALUE} from "@libraries/timeline";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeTimeline(oldTimelines: Map<string, TMB.Timeline>, identity: string, newTimeline: RecursivePartial<TMB.Timeline>) {
  const timelines = new Map(oldTimelines);
  const timeline = timelines.get(identity)!;

  timelines.set(identity, merge<TMB.Timeline>(timeline, newTimeline as Partial<TMB.Timeline>));

  return timelines;
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
    (identity: TMB.TimelineIdentity, lastReadID) => ({
      state: {
        lastReadID: lastReadID,
      },
    }),
    (identity: TMB.TimelineIdentity, lastReadID) => ({
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
    (identity: TMB.TimelineIdentity, mode: TMB.ArticleMode) => ({mode}),
    (identity: TMB.TimelineIdentity, mode: TMB.ArticleMode) => ({
      identity,
    }),
  ],
  OPEN: [
    (identity: TMB.TimelineIdentity) => {},
    (identity: TMB.TimelineIdentity) => ({
      identity,
    }),
  ],
  CLOSE: [
    (identity: TMB.TimelineIdentity) => {},
    (identity: TMB.TimelineIdentity) => ({
      identity,
    }),
  ],
});

export default handleActions<TMB.TimelineMap, RecursivePartial<TMB.Timeline>, {identity: TMB.TimelineIdentity}>(
  {
    [updateTweets.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<TMB.Timeline>);
    },
    [read.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<TMB.Timeline>);
    },
    [setupSearch.toString()]: (state, action) => {
      let query = (action.payload as RecursivePartial<TMB.Timeline>).state!.query;
      if (query) {
        query = query.trim();
      } else {
        query = "";
      }

      return mergeTimeline(state, action.meta.identity, {
        tweets: [],
        state: {
          query: query,
        },
      });
    },
    [changeMode.toString()]: (state, action) => {
      const {identity} = action.meta;

      return mergeTimeline(state, identity, action.payload as RecursivePartial<TMB.Timeline>);
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
