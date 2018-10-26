import {createActions, handleActions} from "redux-actions";

const objectAssignDeep = require(`object-assign-deep`);

export const {selectTab, updateTweets, updateTweetsInSubContents, read, zoomIn, zoomOut, zoomReset, setupSearch} = createActions({
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
  READ: (lastReadID) => ({
    lastReadID: lastReadID,
  }),
  ZOOM_IN: () => {},
  ZOOM_OUT: () => {},
  ZOOM_RESET: () => {},
  SETUP_SEARCH: (query) => ({
    query: query,
  }),
});

export default handleActions<any, any, any>(
  {
    [selectTab.toString()]: (state, action) => ({
      ...state,
      tab: action.payload.tab,
    }),
    [updateTweets.toString()]: (state, action) => {
      return objectAssignDeep.noMutate(state, {
        contents: {
          [action.meta.tab]: action.payload,
        },
      });
    },
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      subcontents: action.payload,
    }),
    [read.toString()]: (state, action) => {
      return objectAssignDeep.noMutate(state, {
        contents: {
          [state.tab]: action.payload,
        },
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

      return objectAssignDeep.noMutate(state, {
        contents: {
          Search: {tweets: [], query: query},
        },
      });
    },
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
export const {reload, focusLatestTweet, focusUnreadTweet, displayUserTimeline, displayConversation, mountComponent, searchTweets, alarm} = createActions({
  RELOAD: [(force, tab) => null, (force, tab) => ({force: force, tab: tab})],
  FOCUS_LATEST_TWEET: () => null,
  FOCUS_UNREAD_TWEET: () => null,
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  DISPLAY_CONVERSATION: (tweet) => ({tweet: tweet}),
  MOUNT_COMPONENT: (tab) => ({tab: tab}),
  SEARCH_TWEETS: (query) => ({query: query}),
  ALARM: (message) => ({message: message}),
});
