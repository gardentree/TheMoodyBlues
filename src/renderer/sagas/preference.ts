import {put, call, takeLatest, select} from "redux-saga/effects";
import * as actions from "@actions";
import {BaseAction} from "redux-actions";
import * as libraries from "@libraries/screen";
import {wrap} from "./library";
import adapters from "@libraries/adapter";

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

    for (const branch of adapters.lineage.getSelectors().selectById(lineage, identity)?.branches || []) {
      yield put(actions.clip({root: identity, branch: branch}));
      yield put(actions.closeScreen(branch));
    }
  }
}
function extractActives(preferences: TMB.PreferenceMap): TMB.ScreenID[] {
  return Object.values(preferences.entities)
    .filter((preference) => preference!.screen.active)
    .map((preference) => preference!.identity);
}

// prettier-ignore
export default [
  takeLatest(actions.prepareState.type, wrap(prepareState)),
  takeLatest(actions.reconfigure.type, wrap(reconfigure)),
];

console.log(actions.prepareState.type);
