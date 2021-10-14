import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import getSaga from "./contents";
import * as home from "../modules/home";

const {TheMoodyBlues} = window;

function* initialize(action: TheMoodyBlues.HomeAction) {
  const {payload} = action;
  const state: TheMoodyBlues.State = yield select();

  yield getSaga(state, payload!.identity).initialize(action);
}

function* reorder(action: ActionType) {
  const {tab} = ((yield select()) as TheMoodyBlues.State).home;

  yield order(action.meta.tab || tab, action);
}
function* order(tab: string, action: ActionType) {
  yield getSaga((yield select()) as TheMoodyBlues.State, tab).order(action);
}

function* searchTweets(action: ActionType) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(home.selectTab(identity));
  yield put(home.setupSearch(identity, query));
  yield reorder(home.reload(true, identity, true) as ActionType);
}

function* displayUserTimeline(action: ActionType) {
  const {agent} = yield select();

  let tweets: TweetType[] = yield call(agent.retrieveTimelineOfUser, action.payload.name);
  yield put(home.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ActionType) {
  const {agent} = yield select();

  let tweets: TweetType[] = yield call(agent.retrieveConversation, action.payload.tweet);
  yield put(home.updateTweetsInSubContents(tweets));
}

const wrap = (saga: any) =>
  function* (action: ActionType) {
    TheMoodyBlues.logger.info(action);
    try {
      const loading = !action.meta || !action.meta.silently;

      if (loading) yield put(home.showLoading(true));
      yield call(saga, action);
      if (loading) yield put(home.showLoading(false));
    } catch (error: any) {
      TheMoodyBlues.logger.error(error);
      TheMoodyBlues.logger.error(error.stack);
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
