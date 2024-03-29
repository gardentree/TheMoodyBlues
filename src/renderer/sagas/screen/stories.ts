import {put, call, select} from "redux-saga/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {selectFocusedScreenID} from "@libraries/selector";
import * as actions from "@actions";
import * as metronome from "../metronome";
import adapters from "@libraries/adapter";
import * as lodash from "lodash";

const {facade} = window;

export function* launch(action: PayloadAction<{identifier: TMB.ScreenID}>) {
  const {payload} = action;
  const {backstages} = yield select();
  const backstage = adapters.backstages.getSelectors().selectById(backstages, payload.identifier)!;

  yield metronome.launch(payload.identifier, backstage);
}

export function* reorder(action: PayloadAction<{identifier: TMB.ScreenID}, string, {force: boolean}>) {
  yield order(action.payload.identifier, action.meta.force);
}
export function* reorderFocusedScreen(action: PayloadAction<Record<string, never>, string, {force: boolean}>) {
  const focused = selectFocusedScreenID(yield select());

  yield order(focused, action.meta.force);
}
function* order(identifier: TMB.ScreenID, force: boolean) {
  const {screens, backstages, gatekeeper}: TMB.State = yield select();
  const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;
  const backstage = adapters.backstages.getSelectors().selectById(backstages, identifier)!;

  const checkedGatekeeper = checkGatekeeper(gatekeeper);
  if (checkedGatekeeper.checkedAt != gatekeeper.checkedAt) {
    yield put(actions.updateGatekeeper(checkedGatekeeper));
  }

  yield metronome.play(identifier, screen, backstage, checkedGatekeeper, force);
}
export function checkGatekeeper(gatekeeper: TMB.Gatekeeper): TMB.Gatekeeper {
  const newGatekeeper = lodash.cloneDeep(gatekeeper);

  const now = Date.now();
  if (newGatekeeper.checkedAt + 1000 * 60 < now) {
    newGatekeeper.checkedAt = now;

    for (const passenger of Object.values(newGatekeeper.passengers)) {
      for (const taboo of Object.values(passenger.taboos)) {
        if (taboo.expireAt && taboo.expireAt < now) {
          delete newGatekeeper.passengers[passenger.identifier].taboos[taboo.keyword];
        }
      }
    }
  }

  return newGatekeeper;
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
