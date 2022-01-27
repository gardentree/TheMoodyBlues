import {put, call, takeLatest, takeEvery, select} from "redux-saga/effects";
import * as timelines from "@modules/timelines";
import * as subcontents from "@modules/subcontents";
import * as principal from "@modules/principal";
import * as metronome from "./metronome";

const {facade} = window;

function* initialize(action: TheMoodyBlues.ReduxAction) {
  const {payload} = action;
  const {timelines} = yield select();
  const timeline = timelines.get(payload.identity)!;

  yield metronome.launch(timeline);
}

function* reorder(action: TheMoodyBlues.ReduxAction) {
  const {focused} = ((yield select()) as TheMoodyBlues.Store.State).principal;

  yield order(action.meta.tab || focused, action);
}
function* order(identity: string, action: TheMoodyBlues.ReduxAction) {
  const {agent, timelines} = yield select();
  const timeline = timelines.get(identity)!;

  yield metronome.play(timeline, agent, action.meta.force);
}

function* searchTweets(action: TheMoodyBlues.ReduxAction) {
  const {query} = action.payload;
  const identity = "search"; //TODO 動的にする？

  yield put(principal.selectTab(identity));
  yield put(timelines.setupSearch(identity, query));
  yield reorder(timelines.reload(true, identity, true) as TheMoodyBlues.ReduxAction);
}

function* displayUserTimeline(action: TheMoodyBlues.ReduxAction) {
  const {agent} = yield select();

  let tweets: Twitter.Tweet[] = yield call(agent.retrieveTimelineOfUser, action.payload.name);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

function* displayConversation(action: TheMoodyBlues.ReduxAction) {
  const {agent} = yield select();

  let tweets: Twitter.Tweet[] = yield call(agent.retrieveConversation, action.payload.tweet, action.meta.options);
  yield put(subcontents.updateTweetsInSubContents(tweets));
}

function* shutdown(action: TheMoodyBlues.ReduxAction) {
  const {payload} = action;

  yield metronome.close(payload.identity);
}

const wrap = (saga: any) =>
  function* (action: TheMoodyBlues.ReduxAction) {
    facade.logger.info(action);
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
