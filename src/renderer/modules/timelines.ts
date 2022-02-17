import {createActions, handleActions} from "redux-actions";
import merge from "@libraries/merger";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function mergeTimeline(oldTimelines: Map<string, TheMoodyBlues.Timeline>, identity: string, newTimeline: RecursivePartial<TheMoodyBlues.Timeline>) {
  const timelines = new Map(oldTimelines);
  const timeline = timelines.get(identity)!;

  timelines.set(identity, merge<TheMoodyBlues.Timeline>(timeline, newTimeline as Partial<TheMoodyBlues.Timeline>));

  return timelines;
}

export const {updateTweets, read, setupSearch, refreshPreferences, changeMode} = createActions({
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
  changeMode: [
    (identity: TheMoodyBlues.TimelineIdentity, mode: TheMoodyBlues.ArticleMode) => ({mode}),
    (identity: TheMoodyBlues.TimelineIdentity, mode: TheMoodyBlues.ArticleMode) => ({
      identity,
    }),
  ],
  REFRESH_PREFERENCES: (timelines: TheMoodyBlues.TimelineMap) => timelines,
});

//FIXME refreshPreferencesを分割したい
export default handleActions<TheMoodyBlues.TimelineMap, RecursivePartial<TheMoodyBlues.Timeline> | TheMoodyBlues.TimelineMap, {identity: TheMoodyBlues.TimelineIdentity}>(
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
    [refreshPreferences.toString()]: (state, action) => {
      return action.payload as TheMoodyBlues.TimelineMap;
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
