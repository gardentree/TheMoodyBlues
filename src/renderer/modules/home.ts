import {createActions, handleActions} from "redux-actions";

export const {selectTab, updateTweets, updateTweetsInSubContents, zoomIn, zoomOut, zoomReset} = createActions({
  SELECT_TAB: (tab) => ({
    tab: tab,
  }),
  UPDATE_TWEETS: [
    (tweets, tab, options = undefined) => ({
      tweets: tweets,
      ...options,
    }),
    (tweets, tab) => ({
      tab: tab,
    }),
  ],
  UPDATE_TWEETS_IN_SUB_CONTENTS: (tweets) => ({tweets: tweets}),
  ZOOM_IN: () => {},
  ZOOM_OUT: () => {},
  ZOOM_RESET: () => {},
});

export default handleActions<any, any, any>(
  {
    [selectTab.toString()]: (state, action) => ({
      ...state,
      tab: action.payload.tab,
    }),
    [updateTweets.toString()]: (state, action) => ({
      ...state,
      contents: {
        ...state.contents,
        [action.meta.tab]: action.payload,
      },
    }),
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      subcontents: action.payload,
    }),
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
  },
  {
    tab: null,
    contents: {},
    subcontents: {},
    style: {
      fontSize: "12px",
    },
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
export const {reload, focusLatestTweet, focusUnreadTweet, displayUserTimeline, mountComponent, searchTweets} = createActions({
  RELOAD: [(force, tab) => null, (force, tab) => ({force: force, tab: tab})],
  FOCUS_LATEST_TWEET: () => null,
  FOCUS_UNREAD_TWEET: () => null,
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  MOUNT_COMPONENT: (tab) => ({tab: tab}),
  SEARCH_TWEETS: (query) => ({query: query}),
});