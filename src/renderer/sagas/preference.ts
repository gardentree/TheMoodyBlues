import {put, call, takeLatest, select} from "redux-saga/effects";
import * as actions from "@actions";
import {ActionMeta, BaseAction} from "redux-actions";
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
  takeLatest(actions.prepareState, wrap(prepareState)),
  takeLatest(actions.reconfigure, wrap(reconfigure)),
];
