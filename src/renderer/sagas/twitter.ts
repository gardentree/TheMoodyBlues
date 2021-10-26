import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import getSaga from "./contents";
import * as timelines from "@modules/timelines";
import * as subcontents from "@modules/subcontents";
import * as principal from "@modules/principal";

const {TheMoodyBlues} = window;

function* initialize(action: TheMoodyBlues.HomeAction) {
  const {payload} = action;
  const state: TheMoodyBlues.Store.State = yield select();

  yield getSaga(state, payload!.identity).initialize(action);
}

function* reorder(action: ActionType) {
  const {focused} = ((yield select()) as TheMoodyBlues.Store.State).principal;

  yield order(action.meta.tab || focused, action);
}
function* order(tab: string, action: ActionType) {
  yield getSaga((yield select()) as TheMoodyBlues.Store.State, tab).order(action);
}

function* searchTweets(action: ActionType) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(principal.selectTab(identity));
  yield put(timelines.setupSearch(identity, query));
  yield reorder(timelines.reload(true, identity, true) as ActionType);
}

function* displayUserTimeline(action: ActionType) {
  const {agent} = yield select();

  let tweets: TweetType[] = yield call(agent.retrieveTimelineOfUser, action.payload.name);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ActionType) {
  const {agent} = yield select();

  let tweets: TweetType[] = yield call(agent.retrieveConversation, action.payload.tweet);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

const wrap = (saga: any) =>
  function* (action: ActionType) {
    TheMoodyBlues.logger.info(action);
    try {
      const loading = !action.meta || !action.meta.silently;

      if (loading) yield put(principal.showLoading(true));
      yield call(saga, action);
      if (loading) yield put(principal.showLoading(false));
    } catch (error: any) {
      TheMoodyBlues.logger.error(error);
      TheMoodyBlues.logger.error(error.stack);
      yield put(principal.alarm(error));
    }
  };

// prettier-ignore
export default [
  takeLatest(timelines.reload, wrap(reorder)),
  takeLatest(timelines.searchTweets, wrap(searchTweets)),
  takeLatest(subcontents.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(subcontents.displayConversation, wrap(displayConversation)),
  takeEvery(timelines.mountComponent, wrap(initialize))
];
