import {createAction} from "@reduxjs/toolkit";

export const prepareState = createAction("prepareState");
export const reconfigure = createAction("reconfigure");

export const reload = createAction("reload", (identity: TMB.ScreenID, force: boolean, silently = false) => ({
  payload: {
    identity,
  },
  meta: {
    force,
    silently,
  },
}));
export const reloadFocusedScreen = createAction("reloadFocusedScreen", (force: boolean, silently = false) => ({
  payload: undefined,
  meta: {
    force,
    silently,
  },
}));

export const mountScreen = createAction("mountScreen", (identity: TMB.ScreenID) => ({
  payload: {identity},
}));
export const unmountScreen = createAction("unmountScreen", (identity: TMB.ScreenID) => ({
  payload: {identity},
}));

export const searchTweets = createAction("searchTweets", (query: string) => ({
  payload: {identity: "search", query},
}));

export const displayUserTimeline = createAction("displayUserTimeline", (name: Twitter.ScreenName) => ({
  payload: {name},
}));
export const displayConversation = createAction("displayConversation", (tweet: Twitter.Tweet, options?: {yourself?: boolean}) => ({
  payload: {tweet},
  meta: {options},
}));

export const focusTweet = createAction("focusTweet", (tweet: Twitter.Tweet) => ({
  payload: {tweet},
}));
export const focusLatestTweet = createAction("focusLatestTweet");
export const focusUnreadTweet = createAction("focusUnreadTweet");

export const alarm = createAction("alarm", (message: string | Error) => ({
  payload: {message},
}));
