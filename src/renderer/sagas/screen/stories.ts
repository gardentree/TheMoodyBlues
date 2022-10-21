import {put, call, select} from "redux-saga/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {selectFocusedScreenID} from "@libraries/selector";
import * as actions from "@actions";
import * as metronome from "../metronome";
import adapters from "@libraries/adapter";

const {facade} = window;

export function* launch(action: PayloadAction<{identity: TMB.ScreenID}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = adapters.preferences.getSelectors().selectById(preferences, payload.identity)!;

  yield metronome.launch(payload.identity, preference.screen);
}

export function* reorder(action: PayloadAction<{identity: TMB.ScreenID}, string, {force: boolean}>) {
  yield order(action.payload.identity, action.meta.force);
}
export function* reorderFocusedScreen(action: PayloadAction<Record<string, never>, string, {force: boolean}>) {
  const focused = selectFocusedScreenID(yield select());

  yield order(focused, action.meta.force);
}
function* order(identity: TMB.ScreenID, force: boolean) {
  const {screens, preferences}: TMB.State = yield select();
  const screen = adapters.screens.getSelectors().selectById(screens, identity)!;
  const preference = adapters.preferences.getSelectors().selectById(preferences, identity)!;

  yield metronome.play(identity, screen, preference, force);
}

export function* searchTweets(action: PayloadAction<{identity: TMB.ScreenID; query: string}>) {
  const {identity, query} = action.payload;

  yield put(actions.focusScreen(identity));
  yield put(actions.setupSearch({identity, query}));
  yield order(identity, true);
}

export function* displayUserTimeline(action: PayloadAction<{name: Twitter.ScreenName}>) {
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveTimelineOfUser, action.payload.name);

  yield branch(tweets);
}
export function* displayConversation(action: PayloadAction<{tweet: Twitter.Tweet}, string, {options: {yourself?: boolean}}>) {
  const {tweet: source} = action.payload;
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveConversation, source, action.meta.options);

  yield branch(tweets, source);
}
export function* branch(tweets: Twitter.Tweet[], source?: Twitter.Tweet) {
  const root = selectFocusedScreenID(yield select());
  const branch = `${root}.${Date.now()}`;

  yield put(actions.prepareScreen(branch));
  yield put(actions.updateTweets({identity: branch, tweets, options: {source}}));
  yield put(actions.mark({identity: branch, lastReadID: "MAX_VALUE"}));
  yield put(actions.branch({root, branch}));
}

export function* shutdown(action: PayloadAction<{identity: TMB.ScreenID}>) {
  const {payload} = action;

  yield metronome.close(payload.identity);
}
