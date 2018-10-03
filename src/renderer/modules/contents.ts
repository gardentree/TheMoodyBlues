import Action from "../others/action";
import * as twitter from "../others/twitter";

const SYSTEM_UPDATE_TWEETS = "SYSTEM_UPDATE_TWEETS";

const initialState = {};
export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case SYSTEM_UPDATE_TWEETS:
      return {...state, [action.meta.name]: action.payload};
    default:
      return state;
  }
}

export const update = (tweets: twitter.Tweet[], screenName: string, options: any = null) => ({
  type: SYSTEM_UPDATE_TWEETS,
  payload: {tweets: tweets, ...options},
  meta: {name: screenName},
  error: false,
});

export const RELOAD = "RELOAD";
export const reload = (force: boolean, screen: string | null) => ({
  type: RELOAD,
  payload: null,
  meta: {force: force, screen: screen},
  error: false,
});

export const FOCUS_LATEST_TWEET = "FOCUS_LATEST_TWEET";
export const focusLatestTweet = () => ({
  type: FOCUS_LATEST_TWEET,
  payload: null,
  meta: null,
  error: false,
});

export const FOCUS_UNREAD_TWEET = "FOCUS_UNREAD_TWEET";
export const focusUnreadTweet = () => ({
  type: FOCUS_UNREAD_TWEET,
  payload: null,
  meta: null,
  error: false,
});
