import {put, call, spawn} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import ActionType from "../../types/action";
import {TweetType} from "../../types/twitter";
import * as home from "../../modules/home";
import * as storage from "../../helpers/storage";

export default class MentionsSaga extends ComponentSaga {
  constructor(account: any, content: any) {
    super(account, content);
  }

  *initialize(action: ActionType) {
    const tweets: TweetType[] = yield call(storage.getTweets, "Mentions");

    if (tweets.length > 0) {
      yield put(home.updateTweets(tweets, action.payload.tab));
      yield put(home.read(tweets[0].id));
    } else {
      yield put(home.updateTweets([], action.payload.tab));
    }

    yield spawn(this.runTimer, "Mentions", 60 * 1000);
    yield this.restartTimer("Mentions");
  }
  *order(action: ActionType) {
    if (action.meta.force) this.content.tweets = [];

    const tweets: TweetType[] = yield call(this.account.mentionsTimeline, this.latest());
    if (tweets.length > 0) {
      const newTweets = tweets.concat(this.content.tweets).slice(0, 400);

      yield call(storage.setTweets, "Mentions", newTweets);
      yield put(home.updateTweets(newTweets, "Mentions"));
    }
    yield this.restartTimer("Mentions");
  }
}
