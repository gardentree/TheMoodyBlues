import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import * as subcontents from "@modules/subcontents";
import * as principal from "@modules/principal";
import * as metronome from "./metronome";

const {facade} = window;

function* initialize(action: ReduxAction) {
  const {payload} = action;
  const {timelines} = yield select();
  const timeline = timelines.get(payload.identity)!;

  yield metronome.launch(timeline);
}

function* reorder(action: ReduxAction) {
  const {focused} = ((yield select()) as State).principal;

  yield order(action.meta.tab || focused, action);
}
function* order(identity: string, action: ReduxAction) {
  const {timelines}: State = yield select();
  const timeline = timelines.get(identity)!;

  yield metronome.play(timeline, action.meta.force);
}

function* searchTweets(action: ReduxAction) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(principal.selectTab(identity));
  yield put(timelines.setupSearch(identity, query));
  yield reorder(timelines.reload(true, identity, true) as ReduxAction);
}

function* displayUserTimeline(action: ReduxAction) {
  let tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveTimelineOfUser, action.payload.name);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: ReduxAction) {
  let tweets: Twitter.Tweet[] = yield call(facade.agent.retrieveConversation, action.payload.tweet, action.meta.options);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

function* shutdown(action: ReduxAction) {
  const {payload} = action;

  yield metronome.close(payload.identity);
}

const wrap = (saga: any) =>
  function* (action: ReduxAction) {
    facade.logger.verbose(action);
    try {
      const loading = !action.meta || !action.meta.silently;

      if (loading) yield put(principal.showLoading(true));
      yield call(saga, action);
      if (loading) yield put(principal.showLoading(false));
    } catch (error: any) {
      facade.logger.error(error);
      facade.logger.error(error.stack);
      yield put(principal.alarm(error));
    }
  };

// prettier-ignore
export default [
  takeLatest(timelines.reload, wrap(reorder)),
  takeLatest(timelines.searchTweets, wrap(searchTweets)),
  takeLatest(subcontents.displayUserTimeline, wrap(displayUserTimeline)),
  takeLatest(subcontents.displayConversation, wrap(displayConversation)),
  takeEvery(timelines.mountComponent, wrap(initialize)),
  takeEvery(timelines.unmountComponent, wrap(shutdown))
];
