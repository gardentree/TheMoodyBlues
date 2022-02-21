import {createActions, handleActions} from "redux-actions";

export const {updateTweetsInSubContents} = createActions({
  UPDATE_TWEETS_IN_SUB_CONTENTS: (tweets) => ({tweets: tweets}),
});

export default handleActions<TMB.SubContents, TMB.SubContents, {}>(
  {
    [updateTweetsInSubContents.toString()]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  {tweets: []}
);
