import {createActions} from "redux-actions";
import * as screens from "./screens";
import * as preferences from "./preferences";
import * as principal from "./principal";
import * as lineage from "./lineage";

export const {initialize, reconfigure} = createActions({
  INITIALIZE: () => null,
  RECONFIGURE: () => null,
});

export const {reload, mountComponent, unmountComponent, searchTweets} = createActions({
  RELOAD: [(force, tab) => null, (force, tab, silently = false) => ({force: force, tab: tab, silently: silently})],
  MOUNT_COMPONENT: (identity) => ({identity: identity}),
  UNMOUNT_COMPONENT: (identity) => ({identity: identity}),
  SEARCH_TWEETS: (query) => ({query: query}),
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

export const {updateTweets, read, setupSearch, changeMode, open, close} = screens;
export const {updatePreference} = preferences;
export const {setup, selectTab, zoomIn, zoomOut, zoomReset, showLoading} = principal;
export const {branch, clip} = lineage;
