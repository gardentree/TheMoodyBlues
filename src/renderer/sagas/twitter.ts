import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import getSaga from "./contents";
import ActionType from "../types/action";
import * as home from "../modules/home";

const logger = require("electron-log");

function* initialize(action: ActionType) {
  const {payload} = action;
  const state = yield select();
  const home = state.home;

  if (!home.contents) home.contents = {};
  home.contents[payload.tab] = {};

  yield getSaga(state, payload.tab).initialize(action);
}

function* reorder(action: ActionType) {
  const {tab} = (yield select()).home;

  yield order(action.meta.tab || tab, action);
}
function* order(tab: string, action: ActionType) {
  yield getSaga(yield select(), tab).order(action);
}

function* searchTweets(action: ActionType) {
  const {query} = action.payload;

  yield put(home.selectTab("Search"));
  yield put(home.setupSearch(query));
  yield put(home.reload(true, "Search"));
}

function* displayUserTimeline(action: ActionType) {
  const {account} = yield select();

  let tweets = yield call(account.userTimeline, action.payload.name);
  yield put(home.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ActionType) {
  const {account} = yield select();

  let tweets = yield call(account.conversation, action.payload.tweet);
  yield put(home.updateTweetsInSubContents(tweets));
}

const wrap = (saga: any) =>
  function*(action: ActionType) {
    logger.info(action);
    try {
      yield call(saga, action);
    } catch (error) {
      logger.error(error);
      yield put(home.alarm(error));
    }
  };

// prettier-ignore
export default [
  takeLatest(home.reload, wrap(reorder)),
  takeLatest(home.searchTweets, wrap(searchTweets)),
  takeLatest(home.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(home.displayConversation, wrap(displayConversation)),
  takeEvery(home.mountComponent, wrap(initialize))
];
