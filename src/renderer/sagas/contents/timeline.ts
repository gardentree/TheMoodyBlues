import {put, call, fork} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import ActionType from "../../types/action";
import * as home from "../../modules/home";
import * as storage from "../../helpers/storage";
import mute from "../../helpers/mute";
import growl from "../../helpers/growly";

export default class TimelineSaga extends ComponentSaga {
  constructor(account: any, content: any) {
    super(account, content);
  }

  *initialize(action: ActionType) {
    const tweets = yield call(storage.getTweets, "Timeline");

    yield put(home.selectTab("Timeline"));
    if (tweets.length > 0) {
      yield put(home.updateTweets(tweets, action.payload.tab));
      yield put(home.read(tweets[0].id));
    } else {
      yield put(home.updateTweets([], action.payload.tab));
    }

    yield fork(this.runTimer, "Timeline", 120 * 1000);
    yield this.restartTimer("Timeline");
  }
  *order(action: ActionType) {
    if (action.meta.force) this.content.tweets = [];

    let tweets = yield call(this.account.timeline, this.latest());
    if (tweets.length > 0) {
      tweets = mute(tweets);
      growl(tweets);

      const newTweets = tweets.concat(this.content.tweets).slice(0, 400);

      yield call(storage.setTweets, "Timeline", newTweets);
      yield put(home.updateTweets(newTweets, "Timeline"));
    }
    yield this.restartTimer("Timeline");
  }
}
