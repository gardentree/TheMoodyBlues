import {put, call, takeLatest, select} from "typed-redux-saga";
import {PayloadAction} from "@reduxjs/toolkit";
import * as actions from "@actions";
import * as libraries from "@libraries/screen";
import {wrap} from "./library";
import adapters from "@libraries/adapter";

const facade = window.facade;

export function* prepareState(action: PayloadAction) {
  const newPreferences = (yield call(libraries.loadBackstages)) as TMB.NormalizedBackstage;
  const actives = extractActives(newPreferences);

  yield put(actions.prepareBackstages(newPreferences));
  for (const identifier of actives) {
    yield put(actions.prepareScreen(identifier));
  }
  yield put(actions.setScreens(actives));

  const gatekeeper = yield* call(facade.storage.getGatekeeperPreference);
  yield put(actions.updateGatekeeper(gatekeeper));
}
export function* reconfigure(action: PayloadAction<{backstages: TMB.NormalizedBackstage}>) {
  const {backstages: newBackstages} = action.payload;
  const {backstages: oldBackstages, lineage} = yield select();

  facade.storage.setBackstages(newBackstages);

  const newIdentifiers = extractActives(newBackstages);
  const oldIdentifiers = extractActives(oldBackstages);

  yield put(actions.prepareBackstages(newBackstages));
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
function extractActives(backstages: TMB.NormalizedBackstage): TMB.ScreenID[] {
  return Object.values(backstages.entities)
    .filter((backstage) => backstage!.active)
    .map((backstage) => backstage!.identifier);
}

// prettier-ignore
export default [
  takeLatest(actions.prepareState.type, wrap(prepareState)),
  takeLatest(actions.reconfigure.type, wrap(reconfigure)),
];
