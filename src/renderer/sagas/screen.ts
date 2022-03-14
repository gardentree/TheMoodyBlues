import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as actions from "@actions";
import * as metronome from "./metronome";
import {Action, ActionMeta} from "redux-actions";
import {wrap} from "./library";
import {selectFocusedScreenID} from "@libraries/selector";

const {facade} = window;

function* launch(action: Action<{identity: TMB.ScreenID}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = preferences.get(payload.identity)!;

  yield metronome.launch(payload.identity, preference.screen);
}

function* reorder(action: ActionMeta<{identity: TMB.ScreenID}, {force: boolean}>) {
  yield order(action.payload.identity, action.meta.force);
}
function* reorderFocusedScreen(action: ActionMeta<Record<string, never>, {force: boolean}>) {
  const focused = selectFocusedScreenID(yield select());

  yield order(focused, action.meta.force);
}
function* order(identity: TMB.ScreenID, force: boolean) {
  const {screens, preferences}: TMB.State = yield select();
  const screen = screens.get(identity)!;
  const preference = preferences.get(identity)!;

  yield metronome.play(identity, screen, preference, force);
}

function* searchTweets(action: Action<{identity: TMB.ScreenID; query: string}>) {
  const {identity, query} = action.payload;

  yield put(actions.focusScreen(identity));
  yield put(actions.setupSearch(identity, query));
  yield order(identity, true);
}

function* displayUserTimeline(action: Action<{name: Twitter.ScreenName}>) {
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveTimelineOfUser, action.payload.name);

  yield branch(tweets);
}
function* displayConversation(action: ActionMeta<{tweet: Twitter.Tweet}, {options: {yourself?: boolean}}>) {
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveConversation, action.payload.tweet, action.meta.options);

  yield branch(tweets);
}
function* branch(tweets: Twitter.Tweet[]) {
  const root = selectFocusedScreenID(yield select());
  const branch = `${root}.${Date.now()}`;

  yield put(actions.prepareScreen(branch));
  yield put(actions.updateTweets(branch,tweets));
  yield put(actions.mark(branch, "MAX_VALUE"));
  yield put(actions.branch(root, branch));
}

function* shutdown(action: Action<{identity: TMB.ScreenID}>) {
  const {payload} = action;

  yield metronome.close(payload.identity);
}

// prettier-ignore
export default [
  takeLatest(actions.searchTweets, wrap(searchTweets)),
  takeLatest(actions.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(actions.displayConversation, wrap(displayConversation)),
  takeEvery(actions.mountScreen, wrap(launch)),
  takeEvery(actions.unmountScreen, wrap(shutdown)),
  takeEvery(actions.reload, wrap(reorder)),
  takeEvery(actions.reloadFocusedScreen, wrap(reorderFocusedScreen)),
];
