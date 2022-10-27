import {put, call, takeLatest, select} from "redux-saga/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import * as actions from "@actions";
import * as libraries from "@libraries/screen";
import {wrap} from "./library";
import adapters from "@libraries/adapter";

function* prepareState(action: PayloadAction) {
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;
  const actives = extractActives(newPreferences);

  yield put(actions.updatePreferences(newPreferences));
  for (const identifier of actives) {
    yield put(actions.prepareScreen(identifier));
  }
  yield put(actions.setScreens(actives));
}
function* reconfigure(action: PayloadAction) {
  const state: TMB.State = yield select();
  const {lineage} = state;

  const oldPreferences = state.preferences;
  const newPreferences = (yield call(libraries.loadPreferences)) as TMB.PreferenceMap;
  const newIdentifiers = extractActives(newPreferences);
  const oldIdentifiers = extractActives(oldPreferences);

  yield put(actions.updatePreferences(newPreferences));
  for (const identifier of newIdentifiers.filter((key) => !oldIdentifiers.includes(key))) {
    yield put(actions.prepareScreen(identifier));
  }
  yield put(actions.setScreens(newIdentifiers));
  for (const identifier of oldIdentifiers.filter((key) => !newIdentifiers.includes(key))) {
    yield put(actions.closeScreen(identifier));

    for (const branch of adapters.lineage.getSelectors().selectById(lineage, identifier)?.branches || []) {
      yield put(actions.clip({root: identifier, branch: branch}));
      yield put(actions.closeScreen(branch));
    }
  }
}
function extractActives(preferences: TMB.PreferenceMap): TMB.ScreenID[] {
  return Object.values(preferences.entities)
    .filter((preference) => preference!.screen.active)
    .map((preference) => preference!.identifier);
}

// prettier-ignore
export default [
  takeLatest(actions.prepareState.type, wrap(prepareState)),
  takeLatest(actions.reconfigure.type, wrap(reconfigure)),
];
