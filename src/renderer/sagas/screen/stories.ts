import {put, call, select} from "redux-saga/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {selectFocusedScreenID} from "@libraries/selector";
import * as actions from "@actions";
import * as metronome from "../metronome";
import adapters from "@libraries/adapter";

const {facade} = window;

export function* launch(action: PayloadAction<{identifier: TMB.ScreenID}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = adapters.preferences.getSelectors().selectById(preferences, payload.identifier)!;

  yield metronome.launch(payload.identifier, preference);
}

export function* reorder(action: PayloadAction<{identifier: TMB.ScreenID}, string, {force: boolean}>) {
  yield order(action.payload.identifier, action.meta.force);
}
export function* reorderFocusedScreen(action: PayloadAction<Record<string, never>, string, {force: boolean}>) {
  const focused = selectFocusedScreenID(yield select());

  yield order(focused, action.meta.force);
}
function* order(identifier: TMB.ScreenID, force: boolean) {
  const {screens, preferences, gatekeeper}: TMB.State = yield select();
  const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;
  const preference = adapters.preferences.getSelectors().selectById(preferences, identifier)!;

  yield metronome.play(identifier, screen, preference, gatekeeper, force);
}

export function* searchTweets(action: PayloadAction<{identifier: TMB.ScreenID; query: string}>) {
  const {identifier, query} = action.payload;

  yield put(actions.focusScreen(identifier));
  yield put(actions.setupSearch({identifier, query}));
  yield order(identifier, true);
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
  yield put(actions.updateTweets({identifier: branch, tweets, options: {source}}));
  yield put(actions.mark({identifier: branch, lastReadID: "MAX_VALUE"}));
  yield put(actions.branch({root, branch}));
}

export function* shutdown(action: PayloadAction<{identifier: TMB.ScreenID}>) {
  const {payload} = action;

  yield metronome.close(payload.identifier);
}
