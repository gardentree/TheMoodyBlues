import {put, call} from "redux-saga/effects";
import ComponentSaga from "./abstract";
import * as home from "../../modules/home";
import mute from "../../helpers/mute";

const {TheMoodyBlues} = window;

export default class TimelineSaga extends ComponentSaga {
  constructor(agent: TwitterAgent, timeline: TheMoodyBlues.Timeline) {
    super(agent, timeline);
  }

  *initialize(action: TheMoodyBlues.HomeAction) {
    const tweets: TweetType[] = yield call(TheMoodyBlues.storage.getTweets, this.timeline.preference.identity);

    if (tweets.length > 0) {
      yield put(home.updateTweets(tweets, action.payload!.identity));
      yield put(home.read(tweets[0].id));
    } else {
      yield put(home.updateTweets([], action.payload!.identity));
    }

    yield this.spawnTimer();
    yield this.startTimer();
  }
  *order(action: ActionType) {
    if (action.meta.force) this.timeline.tweets = [];

    const parameters = (this.timeline.preference.parameters || []).concat(this.latest());
    let tweets: TweetType[] = yield call(this.agent[this.timeline.preference.way], ...parameters);
    if (tweets.length > 0) {
      tweets = mute(tweets);
      TheMoodyBlues.growl(tweets);

      const newTweets = tweets.concat(this.timeline.tweets).slice(0, 400);

      yield call(TheMoodyBlues.storage.setTweets, this.timeline.preference.identity, newTweets);
      yield put(home.updateTweets(newTweets, this.timeline.preference.identity));
    }
    yield this.restartTimer();
  }
}
