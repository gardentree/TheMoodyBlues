import {createActions, handleActions} from "redux-actions";
import deepmerge from "deepmerge";
import {isPlainObject} from "is-plain-object";

function merge(...values: any[]): any {
  return deepmerge.all(values, {isMergeableObject: isPlainObject});
}
function mergeTimeline(oldTimelines: Map<string, TheMoodyBlues.Timeline>, identity: string, newTimeline: any) {
  const timelines = new Map(oldTimelines);
  const timeline: TheMoodyBlues.Timeline = timelines.get(identity)!;

  timelines.set(identity, merge(timeline, newTimeline));

  return timelines;
}

export const {selectTab, updateTweets, updateTweetsInSubContents, read, zoomIn, zoomOut, zoomReset, setupSearch, showLoading} = createActions({
  SELECT_TAB: (identity) => ({
    identity: identity,
  }),
  UPDATE_TWEETS: [
    (tweets, identity, options = undefined) => ({
      tweets: tweets,
      ...options,
    }),
    (tweets, identity) => ({
      identity: identity,
    }),
  ],
  UPDATE_TWEETS_IN_SUB_CONTENTS: (tweets) => ({tweets: tweets}),
  READ: (lastReadID) => ({
    lastReadID: lastReadID,
  }),
  ZOOM_IN: () => {},
  ZOOM_OUT: () => {},
  ZOOM_RESET: () => {},
  SETUP_SEARCH: [
    (identity: string, query: string) => ({
      query: query,
    }),
    (identity: string, query: string) => ({
      identity: identity,
    }),
  ],
  SHOW_LOADING: (nowLoading: boolean) => ({
    nowLoading: nowLoading,
  }),
});

export default handleActions<TheMoodyBlues.HomeState, any, any>(
  {
    [selectTab.toString()]: (state, action) => ({
      ...state,
      tab: action.payload.identity,
    }),
    [updateTweets.toString()]: (state, action) => {
      return merge(state, {
        timelines: mergeTimeline(state.timelines, action.meta.identity, action.payload),
      });
    },
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      subcontents: action.payload,
    }),
    [read.toString()]: (state, action) => {
      return merge(state, {
        timelines: mergeTimeline(state.timelines, state.tab, {state: action.payload}),
      });
    },
    [zoomIn.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, 1)},
    }),
    [zoomOut.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, -1)},
    }),
    [zoomReset.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, 0)},
    }),
    [setupSearch.toString()]: (state, action) => {
      let query = action.payload.query;
      if (query) {
        query = query.trim();
      } else {
        query = "";
      }

      return merge(state, {
        timelines: mergeTimeline(state.timelines, action.meta.identity, {
          tweets: [],
          state: {
            query: query,
          },
        }),
      });
    },
    [showLoading.toString()]: (state, action) => ({
      ...state,
      nowLoading: action.payload.nowLoading,
    }),
  },
  {
    tab: "",
    timelines: new Map(),
    subcontents: {},
    style: {
      fontSize: "12px",
    },
    nowLoading: false,
  }
);

function fontSize(style: any, offset: number) {
  if (offset == 0) {
    return "12px";
  } else {
    const matcher = style.fontSize.match(/(\d+)px/);
    return `${Number(matcher![1]) + offset}px`;
  }
}

////////////////////
export const {reload, focusLatestTweet, focusUnreadTweet, displayUserTimeline, displayConversation, mountComponent, searchTweets, alarm} = createActions({
  RELOAD: [(force, tab) => null, (force, tab, silently = false) => ({force: force, tab: tab, silently: silently})],
  FOCUS_LATEST_TWEET: () => null,
  FOCUS_UNREAD_TWEET: () => null,
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  DISPLAY_CONVERSATION: (tweet) => ({tweet: tweet}),
  MOUNT_COMPONENT: (identity) => ({identity: identity}),
  SEARCH_TWEETS: (query) => ({query: query}),
  ALARM: (message) => ({message: message}),
});
