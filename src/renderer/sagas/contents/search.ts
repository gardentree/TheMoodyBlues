import {put, call, fork} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import ActionType from "../../types/action";
import * as home from "../../modules/home";

const NAME = "Search";

export default class SearchSaga extends ComponentSaga {
  constructor(account: any, content: any) {
    super(account, content);
  }

  *initialize(action: ActionType) {
    yield fork(this.runTimer, NAME, 60 * 1000);
  }
  *order(action: ActionType) {
    yield put({type: `${NAME}_STOP_TIMER`});

    const query = this.content.query || "";
    if (query.length > 0) {
      const tweets = yield call(this.account.search, query, this.latest());
      const newTweets = tweets.concat(this.content.tweets).slice(0, 400);

      yield put(home.updateTweets(newTweets, NAME, {query: query}));
      if (tweets.length > 0 && this.content.tweets.length <= 0) {
        yield put(home.read(tweets[0].id));
      }

      yield put({type: `${NAME}_START_TIMER`});
    } else {
      yield put(home.setupSearch(""));
    }
  }
}
