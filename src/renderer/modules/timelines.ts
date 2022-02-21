import {createActions, handleActions} from "redux-actions";
import merge from "@libraries/merger";
import {INITIAL_VALUE} from "@libraries/timeline";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeTimeline(oldTimelines: Map<string, TheMoodyBlues.Timeline>, identity: string, newTimeline: RecursivePartial<TheMoodyBlues.Timeline>) {
  const timelines = new Map(oldTimelines);
  const timeline = timelines.get(identity)!;

  timelines.set(identity, merge<TheMoodyBlues.Timeline>(timeline, newTimeline as Partial<TheMoodyBlues.Timeline>));

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
    (identity: TheMoodyBlues.TimelineIdentity, lastReadID) => ({
      state: {
        lastReadID: lastReadID,
      },
    }),
    (identity: TheMoodyBlues.TimelineIdentity, lastReadID) => ({
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
    (identity: TheMoodyBlues.TimelineIdentity, mode: TheMoodyBlues.ArticleMode) => ({mode}),
    (identity: TheMoodyBlues.TimelineIdentity, mode: TheMoodyBlues.ArticleMode) => ({
      identity,
    }),
  ],
  OPEN: [
    (identity: TheMoodyBlues.TimelineIdentity) => {},
    (identity: TheMoodyBlues.TimelineIdentity) => ({
      identity,
    }),
  ],
  CLOSE: [
    (identity: TheMoodyBlues.TimelineIdentity) => {},
    (identity: TheMoodyBlues.TimelineIdentity) => ({
      identity,
    }),
  ],
});

export default handleActions<TheMoodyBlues.TimelineMap, RecursivePartial<TheMoodyBlues.Timeline>, {identity: TheMoodyBlues.TimelineIdentity}>(
  {
    [updateTweets.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<TheMoodyBlues.Timeline>);
    },
    [read.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<TheMoodyBlues.Timeline>);
    },
    [setupSearch.toString()]: (state, action) => {
      let query = (action.payload as RecursivePartial<TheMoodyBlues.Timeline>).state!.query;
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

      return mergeTimeline(state, identity, action.payload as RecursivePartial<TheMoodyBlues.Timeline>);
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

////////////////////
export const {reload, mountComponent, unmountComponent, searchTweets} = createActions({
  RELOAD: [(force, tab) => null, (force, tab, silently = false) => ({force: force, tab: tab, silently: silently})],
  MOUNT_COMPONENT: (identity) => ({identity: identity}),
  UNMOUNT_COMPONENT: (identity) => ({identity: identity}),
  SEARCH_TWEETS: (query) => ({query: query}),
});
