import {put, call} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import * as timelines from "@modules/timelines";

export default class SearchSaga extends ComponentSaga {
  constructor(agent: TwitterAgent, timeline: TheMoodyBlues.Store.Timeline) {
    super(agent, timeline);
  }

  *initialize(action: TheMoodyBlues.HomeAction) {
    yield this.spawnTimer();
  }
  *order(action: ActionType) {
    yield this.stopTimer();

    const query = this.timeline.state.query || "";
    if (query.length > 0) {
      const tweets: TweetType[] = yield call(this.agent.search, query, this.latest());
      const newTweets = tweets.concat(this.timeline.tweets).slice(0, 400);

      yield put(timelines.updateTweets(newTweets, this.timeline.preference.identity, {query: query}));
      if (tweets.length > 0 && this.timeline.tweets.length <= 0) {
        yield put(timelines.read(this.timeline.preference.identity, tweets[0].id));
      }

      yield this.startTimer();
    } else {
      yield put(timelines.setupSearch(this.timeline.preference.identity, ""));
    }
  }
}
