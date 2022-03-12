import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as actions from "@actions";
import * as metronome from "./metronome";
import {Action, ActionMeta} from "redux-actions";

const {facade} = window;

function* launch(action: Action<{identity: TMB.ScreenID}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = preferences.get(payload.identity)!;

  yield metronome.launch(payload.identity, preference.screen);
}

function* reorder(action: ActionMeta<Record<string, never>, {identity: TMB.ScreenID; force: boolean}>) {
  const {focused} = ((yield select()) as TMB.State).principal;

  yield order(action.meta.identity || focused, action);
}
function* order(identity: TMB.ScreenID, action: ActionMeta<Record<string, never>, {force: boolean}>) {
  const {screens, preferences}: TMB.State = yield select();
  const screen = screens.get(identity)!;
  const preference = preferences.get(identity)!;

  yield metronome.play(identity, screen, preference, action.meta.force);
}

function* searchTweets(action: Action<{query: string}>) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(actions.focusScreen(identity));
  yield put(actions.setupSearch(identity, query));
  yield reorder(actions.reload(identity, true, true) as ActionMeta<Record<string, never>, {identity: TMB.ScreenID; force: boolean}>); //FIXME castを消す
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
  const root = ((yield select()) as TMB.State).principal.focused;
  const branch = `${root}.${Date.now()}`;

  yield put(actions.prepareScreen(branch));
  yield put(actions.updateTweets(tweets, branch));
  yield put(actions.branch(root, branch));
}

function* shutdown(action: Action<{identity: TMB.ScreenID}>) {
  const {payload} = action;

  yield metronome.close(payload.identity);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const wrap = (saga: (action: ActionMeta<any, any>) => Generator) =>
  function* (action: ActionMeta<any, any>) {
    facade.logger.verbose(action);

    const loading = !action.meta || !action.meta.silently;
    try {
      if (loading) yield put(actions.showLoading(true));
      yield call(saga, action);
    } catch (error: unknown) {
      facade.logger.error(error);
      if (error instanceof Error) {
        facade.logger.error(error.stack);
      }
      yield put(actions.alarm(error));
    } finally {
      if (loading) yield put(actions.showLoading(false));
    }
  };
/* eslint-enable @typescript-eslint/no-explicit-any */

// prettier-ignore
export default [
  takeLatest(actions.searchTweets, wrap(searchTweets)),
  takeLatest(actions.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(actions.displayConversation, wrap(displayConversation)),
  takeEvery(actions.mountScreen, wrap(launch)),
  takeEvery(actions.unmountScreen, wrap(shutdown)),
  takeEvery(actions.reload, wrap(reorder)),
];
