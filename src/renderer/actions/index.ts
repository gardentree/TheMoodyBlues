import {createActions} from "redux-actions";
import * as screens from "./screens";
import * as preferences from "./preferences";
import * as principal from "./principal";
import * as lineage from "./lineage";

export const {prepareState, reconfigure} = createActions({
  PREPARE_STATE: () => null,
  RECONFIGURE: () => null,
});

export const {reload, mountScreen, unmountScreen, searchTweets} = createActions({
  RELOAD: [() => null, (identity, force, silently = false) => ({identity, force, silently})],
  MOUNT_SCREEN: (identity) => ({identity: identity}),
  UNMOUNT_SCREEN: (identity) => ({identity: identity}),
  SEARCH_TWEETS: (query) => ({identity: "search", query: query}),
});

export const {displayUserTimeline, displayConversation} = createActions({
  DISPLAY_USER_TIMELINE: (name) => ({name: name}),
  DISPLAY_CONVERSATION: [(tweet, options) => ({tweet: tweet}), (tweet, options) => ({options: options})],
});

export const {focusLatestTweet, focusUnreadTweet, alarm} = createActions({
  FOCUS_LATEST_TWEET: () => null,
  FOCUS_UNREAD_TWEET: () => null,
  ALARM: (message) => ({message: message}),
});

export const {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} = screens;
export const {updatePreferences} = preferences;
export const {setScreens, focusScreen, zoomIn, zoomOut, zoomReset, showLoading} = principal;
export const {branch, clip} = lineage;
