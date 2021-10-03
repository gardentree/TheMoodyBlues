import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import getSaga from "./contents";
import ActionType from "../types/action";
import {TweetType} from "../types/twitter";
import * as home from "../modules/home";

const logger = require("electron-log");

interface StateType {
  home: any;
}

function* initialize(action: ActionType) {
  const {payload} = action;
  const state: StateType = yield select();
  const home = state.home;

  if (!home.contents) home.contents = {};
  home.contents[payload.tab] = {};

  yield getSaga(state, payload.tab).initialize(action);
}

function* reorder(action: ActionType) {
  const {tab} = ((yield select()) as StateType).home;

  yield order(action.meta.tab || tab, action);
}
function* order(tab: string, action: ActionType) {
  yield getSaga((yield select()) as StateType, tab).order(action);
}

function* searchTweets(action: ActionType) {
  const {query} = action.payload;

  yield put(home.selectTab("Search"));
  yield put(home.setupSearch(query));
  yield reorder(home.reload(true, "Search", true) as ActionType);
}

function* displayUserTimeline(action: ActionType) {
  const {account} = yield select();

  let tweets: TweetType[] = yield call(account.userTimeline, action.payload.name);
  yield put(home.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ActionType) {
  const {account} = yield select();

  let tweets: TweetType[] = yield call(account.conversation, action.payload.tweet);
  yield put(home.updateTweetsInSubContents(tweets));
}

const wrap = (saga: any) =>
  function* (action: ActionType) {
    logger.info(action);
    try {
      const loading = !action.meta || !action.meta.silently;

      if (loading) yield put(home.showLoading(true));
      yield call(saga, action);
      if (loading) yield put(home.showLoading(false));
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
