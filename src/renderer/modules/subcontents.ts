import {createActions, handleActions} from "redux-actions";

export const {updateTweetsInSubContents} = createActions({
  UPDATE_TWEETS_IN_SUB_CONTENTS: (tweets) => ({tweets: tweets}),
});

export default handleActions<TheMoodyBlues.SubContents, TheMoodyBlues.SubContents, {}>(
  {
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  {tweets: []}
);

////////////////////
export const {displayUserTimeline, displayConversation} = createActions({
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  DISPLAY_CONVERSATION: [(tweet, options) => ({tweet: tweet}), (tweet, options) => ({options: options})],
});
