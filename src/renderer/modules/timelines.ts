import {createActions, handleActions} from "redux-actions";
import merge from "@libraries/merger";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeTimeline(oldTimelines: Map<string, Timeline>, identity: string, newTimeline: RecursivePartial<Timeline>) {
  const timelines = new Map(oldTimelines);
  const timeline = timelines.get(identity)!;

  timelines.set(identity, merge<Timeline>(timeline, newTimeline as Partial<Timeline>));

  return timelines;
}

export const {updateTweets, read, setupSearch, refreshPreferences} = createActions({
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
    (identity: TimelineIdentity, lastReadID) => ({
      state: {
        lastReadID: lastReadID,
      },
    }),
    (identity: TimelineIdentity, lastReadID) => ({
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
  REFRESH_PREFERENCES: (timelines: TimelineMap) => timelines,
});

//FIXME refreshPreferencesを分割したい
export default handleActions<TimelineMap, RecursivePartial<Timeline> | TimelineMap, {identity: TimelineIdentity}>(
  {
    [updateTweets.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<Timeline>);
    },
    [read.toString()]: (state, action) => {
      return mergeTimeline(state, action.meta.identity, action.payload as RecursivePartial<Timeline>);
    },
    [setupSearch.toString()]: (state, action) => {
      let query = (action.payload as RecursivePartial<Timeline>).state!.query;
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
    [refreshPreferences.toString()]: (state, action) => {
      return action.payload as TimelineMap;
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
