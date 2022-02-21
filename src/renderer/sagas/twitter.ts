import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as actions from "@actions";
import * as metronome from "./metronome";
import {Action, ActionMeta, BaseAction} from "redux-actions";
import * as libraries from "@libraries/timeline";

const {facade} = window;

function* initialize(action: BaseAction) {
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;

  const actives = Array.from(newPreferences)
    .filter(([identity, preference]) => preference.timeline.active)
    .map(([identity, preference]) => identity);

  yield put(actions.updatePreference(newPreferences));
  for (const identity of actives) {
    yield put(actions.open(identity));
  }
  yield put(actions.setup(actives));
}
function* reconfigure(action: BaseAction) {
  const state: TMB.State = yield select();
  const oldPreferences = state.preferences;
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;
  const newIdentities = extractActives(newPreferences);
  const oldIdentities = extractActives(oldPreferences);

  yield put(actions.updatePreference(newPreferences));
  for (const identity of newIdentities.filter((key) => !oldIdentities.includes(key))) {
    yield put(actions.open(identity));
  }
  yield put(actions.setup(newIdentities));
  for (const identity of oldIdentities.filter((key) => !newIdentities.includes(key))) {
    yield put(actions.close(identity));
  }
}
function extractActives(preferences: TMB.PreferenceMap): TMB.TimelineIdentity[] {
  return Array.from(preferences.values())
    .filter((preference) => preference.timeline.active)
    .map((preference) => preference.identity);
}

function* launch(action: Action<{identity: TMB.TimelineIdentity}>) {
  const {payload} = action;
  const {preferences} = yield select();
  const preference = preferences.get(payload.identity)!;

  yield metronome.launch(payload.identity, preference.timeline);
}

function* reorder(action: ActionMeta<{}, {tab: TMB.TimelineIdentity; force: boolean}>) {
  const {focused} = ((yield select()) as TMB.State).principal;

  yield order(action.meta.tab || focused, action);
}
function* order(identity: string, action: ActionMeta<{}, {force: boolean}>) {
  const {timelines, preferences}: TMB.State = yield select();
  const timeline = timelines.get(identity)!;
  const preference = preferences.get(identity)!;

  yield metronome.play(identity, timeline, preference, action.meta.force);
}

function* searchTweets(action: Action<{query: string}>) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(actions.selectTab(identity));
  yield put(actions.setupSearch(identity, query));
  yield reorder(actions.reload(true, identity, true) as ActionMeta<{}, {tab: TMB.TimelineIdentity; force: boolean}>); //FIXME castを消す
}

function* displayUserTimeline(action: Action<{name: Twitter.ScreenName}>) {
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveTimelineOfUser, action.payload.name);
  yield put(actions.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ActionMeta<{tweet: Twitter.Tweet}, {options: {yourself?: boolean}}>) {
  const tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveConversation, action.payload.tweet, action.meta.options);
  yield put(actions.updateTweetsInSubContents(tweets));
}

function* shutdown(action: Action<{identity: TMB.TimelineIdentity}>) {
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
  takeLatest(actions.initialize, wrap(initialize)),
  takeLatest(actions.reload, wrap(reorder)),
  takeLatest(actions.searchTweets, wrap(searchTweets)),
  takeLatest(actions.reconfigure, wrap(reconfigure)),
  takeLatest(actions.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(actions.displayConversation, wrap(displayConversation)),
  takeEvery(actions.mountComponent, wrap(launch)),
  takeEvery(actions.unmountComponent, wrap(shutdown))
];
