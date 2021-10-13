import {put, call} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import * as home from "../../modules/home";

export default class SearchSaga extends ComponentSaga {
  constructor(account: any, timeline: TheMoodyBlues.Timeline) {
    super(account, timeline);
  }

  *initialize(action: TheMoodyBlues.HomeAction) {
    yield this.spawnTimer();
  }
  *order(action: ActionType) {
    yield this.stopTimer();

    const query = this.timeline.state.query || "";
    if (query.length > 0) {
      const tweets: TweetType[] = yield call(this.account.search, query, this.latest());
      const newTweets = tweets.concat(this.timeline.tweets).slice(0, 400);

      yield put(home.updateTweets(newTweets, this.timeline.meta.identity, {query: query}));
      if (tweets.length > 0 && this.timeline.tweets.length <= 0) {
        yield put(home.read(tweets[0].id));
      }

      yield this.startTimer();
    } else {
      yield put(home.setupSearch(this.timeline.meta.identity, ""));
    }
  }
}
