import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as actions from "@actions";
import * as metronome from "./metronome";
import {Action, ActionMeta, BaseAction} from "redux-actions";
import * as libraries from "@libraries/screen";

const {facade} = window;

function* prepareState(action: BaseAction) {
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;
  const actives = extractActives(newPreferences);

  yield put(actions.updatePreferences(newPreferences));
  for (const identity of actives) {
    yield put(actions.prepareScreen(identity));
  }
  yield put(actions.setScreens(actives));
}
function* reconfigure(action: BaseAction) {
  const state: TMB.State = yield select();
  const {lineage} = state;

  const oldPreferences = state.preferences;
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;
  const newIdentities = extractActives(newPreferences);
  const oldIdentities = extractActives(oldPreferences);

  yield put(actions.updatePreferences(newPreferences));
  for (const identity of newIdentities.filter((key) => !oldIdentities.includes(key))) {
    yield put(actions.prepareScreen(identity));
  }
  yield put(actions.setScreens(newIdentities));
  for (const identity of oldIdentities.filter((key) => !newIdentities.includes(key))) {
    yield put(actions.closeScreen(identity));

    for (const branch of lineage.get(identity) || []) {
      yield put(actions.clip(identity, branch));
      yield put(actions.closeScreen(branch));
    }
  }
}
function extractActives(preferences: TMB.PreferenceMap): TMB.ScreenID[] {
  return Array.from(preferences.values())
    .filter((preference) => preference.screen.active)
    .map((preference) => preference.identity);
}

function* launch(action: Action<{identity: TMB.ScreenID}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = preferences.get(payload.identity)!;

  yield metronome.launch(payload.identity, preference.screen);
}

function* reorder(action: ActionMeta<{}, {tab: TMB.ScreenID; force: boolean}>) {
  const {focused} = ((yield select()) as TMB.State).principal;

  yield order(action.meta.tab || focused, action);
}
function* order(identity: string, action: ActionMeta<{}, {force: boolean}>) {
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
  yield reorder(actions.reload(true, identity, true) as ActionMeta<{}, {tab: TMB.ScreenID; force: boolean}>); //FIXME castを消す
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

const wrap = (saga: (action: ActionMeta<any, any>) => Generator) =>
  function* (action: ActionMeta<any, any>) {
    facade.logger.verbose(action);
    try {
      const loading = !action.meta || !action.meta.silently;

      if (loading) yield put(actions.showLoading(true));
      yield call(saga, action);
      if (loading) yield put(actions.showLoading(false));
    } catch (error: unknown) {
      facade.logger.error(error);
      if (error instanceof Error) {
        facade.logger.error(error.stack);
      }
      yield put(actions.alarm(error));
    }
  };

// prettier-ignore
export default [
  takeLatest(actions.prepareState, wrap(prepareState)),
  takeLatest(actions.reload, wrap(reorder)),
  takeLatest(actions.searchTweets, wrap(searchTweets)),
  takeLatest(actions.reconfigure, wrap(reconfigure)),
  takeLatest(actions.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(actions.displayConversation, wrap(displayConversation)),
  takeEvery(actions.mountScreen, wrap(launch)),
  takeEvery(actions.unmountScreen, wrap(shutdown))
];
