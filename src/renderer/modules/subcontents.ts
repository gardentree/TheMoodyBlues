import {createActions, handleActions} from "redux-actions";

export const {updateTweetsInSubContents} = createActions({
  UPDATE_TWEETS_IN_SUB_CONTENTS: (tweets) => ({tweets: tweets}),
});

export default handleActions<TheMoodyBlues.Store.SubContents, any, any>(
  {
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  {}
);

////////////////////
export const {displayUserTimeline, displayConversation} = createActions({
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  DISPLAY_CONVERSATION: (tweet) => ({tweet: tweet}),
});
